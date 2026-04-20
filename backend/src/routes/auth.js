const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB } = require('../db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const db = getDB();
    const { name, email, password, address } = req.body;

    // findOne to check existing user
    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // Store hashed password (best practice)
    const hashedPassword = await bcrypt.hash(password, 12);

    // insertOne
    const result = await db.collection('users').insertOne({
      name, email, password: hashedPassword, address: address || '',
      cart: [], wishlist: [], orders: [], createdAt: new Date()
    });

    const token = jwt.sign({ userId: result.insertedId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, userId: result.insertedId, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;

    // findOne for authentication
    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
