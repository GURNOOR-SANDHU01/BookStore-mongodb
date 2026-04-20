const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', auth, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/cart/add - Add to cart using $push / $addToSet
router.post('/cart/add', auth, async (req, res) => {
  try {
    const db = getDB();
    const { bookId, quantity = 1 } = req.body;

    // Check if already in cart, if so $inc qty
    const user = await db.collection('users').findOne({
      _id: new ObjectId(req.user.userId),
      'cart.bookId': new ObjectId(bookId)
    });

    if (user) {
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId), 'cart.bookId': new ObjectId(bookId) },
        { $inc: { 'cart.$.quantity': quantity } }
      );
    } else {
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $push: { cart: { bookId: new ObjectId(bookId), quantity } } }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/cart/remove - Remove from cart using $pull
router.post('/cart/remove', auth, async (req, res) => {
  try {
    const db = getDB();
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.userId) },
      { $pull: { cart: { bookId: new ObjectId(req.body.bookId) } } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/cart
router.get('/cart', auth, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { cart: 1 } }
    );

    if (!user.cart || user.cart.length === 0) return res.json([]);

    // Fetch book details for each cart item
    const bookIds = user.cart.map(c => c.bookId);
    const books = await db.collection('books').find({ _id: { $in: bookIds } }).toArray();

    const cartItems = user.cart.map(item => {
      const book = books.find(b => b._id.toString() === item.bookId.toString());
      return { ...item, book };
    });

    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/wishlist/toggle - $addToSet or $pull
router.post('/wishlist/toggle', auth, async (req, res) => {
  try {
    const db = getDB();
    const { bookId } = req.body;

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { wishlist: 1 } }
    );

    const inWishlist = user.wishlist && user.wishlist.some(id => id.toString() === bookId);

    if (inWishlist) {
      // $pull - remove from wishlist
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $pull: { wishlist: new ObjectId(bookId) } }
      );
      res.json({ wishlisted: false });
    } else {
      // $addToSet - add (no duplicates)
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $addToSet: { wishlist: new ObjectId(bookId) } }
      );
      res.json({ wishlisted: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/wishlist
router.get('/wishlist', auth, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { wishlist: 1 } }
    );

    if (!user.wishlist || !user.wishlist.length) return res.json([]);
    const books = await db.collection('books').find({ _id: { $in: user.wishlist } }).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
