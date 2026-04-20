const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');

// GET /api/books - List books with search, filter, and pagination
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { 
      search, category, minPrice, maxPrice, 
      page = 1, limit = 12, sort = 'createdAt' 
    } = req.query;

    const query = {};

    // $regex for title/author search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Text index search (if no regex search)
    if (!search) {
      // category filter using find()
      if (category && category !== 'All') {
        query.category = category;
      }
    } else if (category && category !== 'All') {
      query.category = category;
    }

    // $gte/$lte price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortObj = sort === 'price' ? { price: 1 } : sort === 'rating' ? { ratings: -1 } : { createdAt: -1 };

    const books = await db.collection('books')
      .find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection('books').countDocuments(query);

    res.json({ books, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/books/categories - distinct categories
router.get('/categories', async (req, res) => {
  try {
    const db = getDB();
    const categories = await db.collection('books').distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/books/top-sold - top selling books (aggregation)
router.get('/top-sold', async (req, res) => {
  try {
    const db = getDB();
    const books = await db.collection('books')
      .find()
      .sort({ totalSold: -1 })
      .limit(5)
      .toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/books/:id - single book
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const book = await db.collection('books').findOne({ _id: new ObjectId(req.params.id) });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/books - Add new book (Admin)
router.post('/', async (req, res) => {
  try {
    const db = getDB();
    const book = { ...req.body, createdAt: new Date(), totalSold: 0, reviews: [], ratings: 0 };
    const result = await db.collection('books').insertOne(book);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/books/:id - Update book (Admin)
router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { _id, ...update } = req.body;
    await db.collection('books').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: update }
    );
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/books/:id - Delete book (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('books').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/books/:id/review - Add review using $push
router.post('/:id/review', async (req, res) => {
  try {
    const db = getDB();
    const { rating, comment, user } = req.body;
    const newReview = { user, rating: parseFloat(rating), comment, date: new Date() };

    await db.collection('books').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { reviews: newReview } }
    );

    // Recalculate average rating using aggregation
    const agg = await db.collection('books').aggregate([
      { $match: { _id: new ObjectId(req.params.id) } },
      { $unwind: '$reviews' },
      { $group: { _id: '$_id', avgRating: { $avg: '$reviews.rating' } } }
    ]).toArray();

    if (agg.length > 0) {
      await db.collection('books').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { ratings: Math.round(agg[0].avgRating * 10) / 10 } }
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
