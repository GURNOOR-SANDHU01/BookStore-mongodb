const express = require('express');
const router = express.Router();
const { getDB, getClient } = require('../db');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');

// POST /api/orders - Place order (with MongoDB transaction)
router.post('/', auth, async (req, res) => {
  const client = getClient();
  const session = client.startSession();
  try {
    const db = getDB();
    const { books } = req.body; // [{ bookId, quantity }]

    let totalPrice = 0;
    const orderBooks = [];

    // Use transaction to atomically place order + decrement stock
    await session.withTransaction(async () => {
      for (const item of books) {
        const book = await db.collection('books').findOne(
          { _id: new ObjectId(item.bookId) },
          { session }
        );
        if (!book) throw new Error(`Book ${item.bookId} not found`);
        if (book.stock < item.quantity) throw new Error(`Insufficient stock for ${book.title}`);

        totalPrice += book.price * item.quantity;
        orderBooks.push({ bookId: new ObjectId(item.bookId), title: book.title, quantity: item.quantity, price: book.price });

        // $inc to reduce stock atomically
        await db.collection('books').updateOne(
          { _id: new ObjectId(item.bookId) },
          { $inc: { stock: -item.quantity, totalSold: item.quantity } },
          { session }
        );
      }

      // insertOne - place the order
      const order = {
        userId: new ObjectId(req.user.userId),
        books: orderBooks,
        total_price: Math.round(totalPrice * 100) / 100,
        status: 'ordered',
        created_at: new Date()
      };
      const result = await db.collection('orders').insertOne(order, { session });

      // Add order reference to user orders array
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $push: { orders: result.insertedId } },
        { session }
      );

      // Clear user cart
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $set: { cart: [] } },
        { session }
      );
    });

    res.status(201).json({ success: true, message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await session.endSession();
  }
});

// GET /api/orders/my - Get logged-in user orders
router.get('/my', auth, async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection('orders')
      .find({ userId: new ObjectId(req.user.userId) })
      .sort({ created_at: -1 })
      .toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/analytics - Revenue & top selling books aggregation
router.get('/analytics', auth, async (req, res) => {
  try {
    const db = getDB();

    // Total revenue aggregation
    const revenueAgg = await db.collection('orders').aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total_price' }, totalOrders: { $sum: 1 } } }
    ]).toArray();

    // Top selling books aggregation
    const topSelling = await db.collection('orders').aggregate([
      { $unwind: '$books' },
      { $group: { _id: '$books.bookId', title: { $first: '$books.title' }, totalSold: { $sum: '$books.quantity' }, revenue: { $sum: { $multiply: ['$books.price', '$books.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]).toArray();

    // Orders by status
    const byStatus = await db.collection('orders').aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();

    res.json({
      revenue: revenueAgg[0] || { totalRevenue: 0, totalOrders: 0 },
      topSelling,
      byStatus
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const db = getDB();
    await db.collection('orders').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    );
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id/detailed - Order with joined book details (Section 6: $lookup)
router.get('/:id/detailed', auth, async (req, res) => {
  try {
    const db = getDB();
    const order = await db.collection('orders').aggregate([
      { $match: { _id: new ObjectId(req.params.id) } },
      { $unwind: '$books' },
      {
        $lookup: {
          from: 'books',
          localField: 'books.bookId',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      {
        $group: {
          _id: '$_id',
          userId: { $first: '$userId' },
          total_price: { $first: '$total_price' },
          status: { $first: '$status' },
          created_at: { $first: '$created_at' },
          books: {
            $push: {
              bookId: '$books.bookId',
              quantity: '$books.quantity',
              price: '$books.price',
              title: '$bookDetails.title',
              image_url: '$bookDetails.image_url',
              category: '$bookDetails.category'
            }
          }
        }
      }
    ]).toArray();

    if (order.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(order[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

