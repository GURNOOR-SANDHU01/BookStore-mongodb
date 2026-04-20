const { getDB } = require('./db');

const BOOKS = [
  {
    title: 'The Great Gatsby',
    author: ['F. Scott Fitzgerald'],
    price: 12.99,
    category: 'Fiction',
    stock: 45,
    description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    image_url: 'https://covers.openlibrary.org/b/id/8432472-L.jpg',
    ratings: 4.5,
    reviews: [
      { user: 'Alice', rating: 5, comment: 'A timeless classic!', date: new Date() },
      { user: 'Bob', rating: 4, comment: 'Beautiful writing but slow plot.', date: new Date() }
    ],
    totalSold: 120,
    createdAt: new Date()
  },
  {
    title: 'To Kill a Mockingbird',
    author: ['Harper Lee'],
    price: 10.99,
    category: 'Fiction',
    stock: 60,
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    image_url: 'https://covers.openlibrary.org/b/id/8810494-L.jpg',
    ratings: 4.8,
    reviews: [
      { user: 'Carol', rating: 5, comment: 'One of the best books ever written.', date: new Date() }
    ],
    totalSold: 200,
    createdAt: new Date()
  },
  {
    title: '1984',
    author: ['George Orwell'],
    price: 9.99,
    category: 'Dystopian',
    stock: 35,
    description: 'A startling and haunting vision of the world, so powerful that it is completely convincing from start to finish.',
    image_url: 'https://covers.openlibrary.org/b/id/8575708-L.jpg',
    ratings: 4.7,
    reviews: [
      { user: 'Dan', rating: 5, comment: 'Absolutely chilling and relevant today.', date: new Date() }
    ],
    totalSold: 180,
    createdAt: new Date()
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: ['Yuval Noah Harari'],
    price: 16.99,
    category: 'Non-Fiction',
    stock: 50,
    description: 'A bold, wide-ranging, and provocative account of the way humans came to dominate the Earth.',
    image_url: 'https://covers.openlibrary.org/b/id/10527843-L.jpg',
    ratings: 4.6,
    reviews: [],
    totalSold: 95,
    createdAt: new Date()
  },
  {
    title: 'Atomic Habits',
    author: ['James Clear'],
    price: 14.99,
    category: 'Self-Help',
    stock: 80,
    description: 'An Easy and Proven Way to Build Good Habits and Break Bad Ones.',
    image_url: 'https://covers.openlibrary.org/b/id/10314550-L.jpg',
    ratings: 4.9,
    reviews: [
      { user: 'Eve', rating: 5, comment: 'Life changing!', date: new Date() }
    ],
    totalSold: 300,
    createdAt: new Date()
  },
  {
    title: 'The Alchemist',
    author: ['Paulo Coelho'],
    price: 11.99,
    category: 'Fiction',
    stock: 40,
    description: 'A marvellous tale about the most essential of dreams and the courage required to follow them.',
    image_url: 'https://covers.openlibrary.org/b/id/8106861-L.jpg',
    ratings: 4.4,
    reviews: [],
    totalSold: 150,
    createdAt: new Date()
  },
  {
    title: 'Clean Code',
    author: ['Robert C. Martin'],
    price: 29.99,
    category: 'Academic',
    stock: 25,
    description: 'A Handbook of Agile Software Craftsmanship — a must read for every programmer.',
    image_url: 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
    ratings: 4.7,
    reviews: [],
    totalSold: 70,
    createdAt: new Date()
  },
  {
    title: 'Dune',
    author: ['Frank Herbert'],
    price: 13.99,
    category: 'Sci-Fi',
    stock: 55,
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides and the powerful planet Arrakis.',
    image_url: 'https://covers.openlibrary.org/b/id/8656665-L.jpg',
    ratings: 4.8,
    reviews: [],
    totalSold: 160,
    createdAt: new Date()
  },
  {
    title: 'The Power of Now',
    author: ['Eckhart Tolle'],
    price: 12.49,
    category: 'Self-Help',
    stock: 30,
    description: 'A guide to spiritual enlightenment about the importance of living in the present moment.',
    image_url: 'https://covers.openlibrary.org/b/id/263234-L.jpg',
    ratings: 4.3,
    reviews: [],
    totalSold: 88,
    createdAt: new Date()
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: ['J.K. Rowling'],
    price: 15.99,
    category: 'Fantasy',
    stock: 100,
    description: 'The first book in the Harry Potter series where a young boy discovers he is a wizard.',
    image_url: 'https://covers.openlibrary.org/b/id/10110415-L.jpg',
    ratings: 4.9,
    reviews: [
      { user: 'Frank', rating: 5, comment: 'Pure magic!', date: new Date() }
    ],
    totalSold: 500,
    createdAt: new Date()
  }
];

async function seed() {
  const db = getDB();
  const books = db.collection('books');
  const users = db.collection('users');

  // Clear existing data
  await books.deleteMany({});
  await users.deleteMany({});

  // Insert books
  const result = await books.insertMany(BOOKS);
  console.log(`✅ Inserted ${result.insertedCount} books`);

  console.log('🌱 Database seeded successfully!');
  process.exit(0);
}

module.exports = { seed };
