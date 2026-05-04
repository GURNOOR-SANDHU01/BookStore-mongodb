const express = require('express');
const router = express.Router();
const { getDB } = require('../db');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');


router.get('/profile', auth, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/cart/add', auth, async (req, res) => {
  try {
    const db = getDB();
    const { bookId, quantity = 1 } = req.body;

    const userExists = await db.collection('users').findOne({ _id: new ObjectId(req.user.userId) });
    if (!userExists) return res.status(404).json({ error: 'User not found' });

    
    const inCart = await db.collection('users').findOne({
      _id: new ObjectId(req.user.userId),
      'cart.bookId': new ObjectId(bookId)
    });

    if (inCart) {
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


router.get('/cart', auth, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { cart: 1 } }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.cart || user.cart.length === 0) return res.json([]);

    
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


router.post('/wishlist/toggle', auth, async (req, res) => {
  try {
    const db = getDB();
    const { bookId } = req.body;

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { wishlist: 1 } }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    const inWishlist = user.wishlist && user.wishlist.some(id => id.toString() === bookId);

    if (inWishlist) {
      
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $pull: { wishlist: new ObjectId(bookId) } }
      );
      res.json({ wishlisted: false });
    } else {
     
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


router.get('/wishlist', auth, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { wishlist: 1 } }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.wishlist || !user.wishlist.length) return res.json([]);
    const books = await db.collection('books').find({ _id: { $in: user.wishlist } }).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch('/profile', auth, async (req, res) => {
  try {
    const db = getDB();
    const { name, phone, removePhone } = req.body;
    
    const update = { $set: {}, $unset: {}, $currentDate: { updatedAt: true } };
    
    if (name) update.$set.name = name;
    if (phone) update.$set.phone = phone;
    if (removePhone) update.$unset.phone = "";

    
    if (Object.keys(update.$set).length === 0) delete update.$set;
    if (Object.keys(update.$unset).length === 0) delete update.$unset;

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.userId) },
      update
    );
    
    if (result.matchedCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

