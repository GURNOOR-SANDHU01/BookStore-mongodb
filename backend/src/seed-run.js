require('dotenv').config();
const { connectDB } = require('./db');
const { seed } = require('./seed');

connectDB().then(seed).catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
