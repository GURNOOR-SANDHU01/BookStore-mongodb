const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');


router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { 
      search, category, minPrice, maxPrice, 
      tags, language,
      page = 1, limit = 12, sort = 'createdAt' 
    } = req.query;

    const query = {};

    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

   
    if (!search) {
    
      if (category && category !== 'All') {
        query.category = category;
      }
    } else if (category && category !== 'All') {
      query.category = category;
    }

  
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }


    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $all: tagArray };
    }


    if (language) {
      query["metadata.language"] = language;
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


router.get('/categories', async (req, res) => {
  try {
    const db = getDB();
    const categories = await db.collection('books').distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


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


router.get('/stats/category', async (req, res) => {
  try {
    const db = getDB();
    const stats = await db.collection('books').aggregate([
      {
        $group: {
          _id: '$category',
          avgPrice: { $avg: '$price' },
          totalBooks: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { totalBooks: -1 } },
      { $project: { 
          category: '$_id', 
          avgPrice: { $round: ['$avgPrice', 2] }, 
          totalBooks: 1, 
          totalStock: 1,
          isPopular: { $gt: ['$totalBooks', 2] }
      } }
    ]).toArray();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


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


router.put('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { _id, ...update } = req.body;
    
    
    await db.collection('books').updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $set: update,
        $currentDate: { lastUpdated: true } 
      }
    );
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch('/:id/rename', async (req, res) => {
  try {
    const db = getDB();
    const { oldName, newName } = req.body;
    await db.collection('books').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $rename: { [oldName]: newName } }
    );
    res.json({ renamed: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    await db.collection('books').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/:id/review', async (req, res) => {
  try {
    const db = getDB();
    const { rating, comment, user } = req.body;
    const newReview = { user, rating: parseFloat(rating), comment, date: new Date() };

    await db.collection('books').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { reviews: newReview } }
    );

   
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
