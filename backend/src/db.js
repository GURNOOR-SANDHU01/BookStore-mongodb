const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;
let client;

async function connectDB() {
  if (db) return db;
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db(process.env.DB_NAME);

  // Create indexes for fast search and text search
  await db.collection('books').createIndex({ title: 'text', author: 'text', description: 'text' });
  await db.collection('books').createIndex({ category: 1 });
  await db.collection('books').createIndex({ price: 1 });
  await db.collection('books').createIndex({ createdAt: -1 });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  console.log('✅ Connected to MongoDB and indexes created');
  return db;
}

function getDB() {
  if (!db) throw new Error('Database not initialized. Call connectDB first.');
  return db;
}

function getClient() {
  return client;
}

module.exports = { connectDB, getDB, getClient };
