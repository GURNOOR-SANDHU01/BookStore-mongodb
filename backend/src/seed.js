const { getDB } = require('./db');

const BOOKS = [
  {
    title: 'The Great Gatsby',
    author: ['F. Scott Fitzgerald'],
    price: 999,
    category: 'Fiction',
    stock: 45,
    tags: ['classic', 'rich', 'romance'],
    metadata: { pages: 180, publisher: 'Scribner', language: 'English' },
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
    price: 799,
    category: 'Fiction',
    stock: 60,
    tags: ['classic', 'justice', 'childhood'],
    metadata: { pages: 281, publisher: 'J.B. Lippincott & Co.', language: 'English' },
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
    price: 699,
    category: 'Dystopian',
    stock: 35,
    tags: ['classic', 'political', 'surveillance'],
    metadata: { pages: 328, publisher: 'Secker & Warburg', language: 'English' },
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
    price: 1499,
    category: 'Non-Fiction',
    stock: 50,
    tags: ['history', 'humanity', 'science'],
    metadata: { pages: 443, publisher: 'Harvill Secker', language: 'English' },
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
    price: 1299,
    category: 'Self-Help',
    stock: 80,
    tags: ['productivity', 'habits', 'success'],
    metadata: { pages: 320, publisher: 'Avery', language: 'English' },
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
    price: 899,
    category: 'Fiction',
    stock: 40,
    tags: ['adventure', 'inspirational', 'philosophy'],
    metadata: { pages: 163, publisher: 'HarperCollins', language: 'English' },
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
    price: 2499,
    category: 'Academic',
    stock: 25,
    tags: ['programming', 'technical', 'best-practices'],
    metadata: { pages: 464, publisher: 'Prentice Hall', language: 'English' },
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
    price: 1199,
    category: 'Sci-Fi',
    stock: 55,
    tags: ['epic', 'space', 'politics'],
    metadata: { pages: 412, publisher: 'Chilton Books', language: 'English' },
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
    price: 1049,
    category: 'Self-Help',
    stock: 30,
    tags: ['spirituality', 'mindfulness', 'peace'],
    metadata: { pages: 236, publisher: 'Namaste Publishing', language: 'English' },
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
    price: 1399,
    category: 'Fantasy',
    stock: 100,
    tags: ['magic', 'young-adult', 'adventure'],
    metadata: { pages: 309, publisher: 'Scholastic', language: 'English' },
    description: 'The first book in the Harry Potter series where a young boy discovers he is a wizard.',
    image_url: 'https://covers.openlibrary.org/b/id/10110415-L.jpg',
    ratings: 4.9,
    reviews: [
      { user: 'Frank', rating: 5, comment: 'Pure magic!', date: new Date() }
    ],
    totalSold: 500,
    createdAt: new Date()
  },
  {
    title: 'Deep Work',
    author: ['Cal Newport'],
    price: 1150,
    category: 'Self-Help',
    stock: 45,
    tags: ['productivity', 'focus', 'success'],
    metadata: { pages: 304, publisher: 'Grand Central Publishing', language: 'English' },
    description: 'Rules for Focused Success in a Distracted World.',
    image_url: 'https://covers.openlibrary.org/b/id/8282683-L.jpg',
    ratings: 4.7,
    reviews: [],
    totalSold: 210,
    createdAt: new Date()
  },
  {
    title: 'Project Hail Mary',
    author: ['Andy Weir'],
    price: 1599,
    category: 'Sci-Fi',
    stock: 40,
    tags: ['space', 'science', 'adventure'],
    metadata: { pages: 476, publisher: 'Ballantine Books', language: 'English' },
    description: 'A lone astronaut must save the earth from disaster in this propulsive SF thriller.',
    image_url: 'https://covers.openlibrary.org/b/id/10609459-L.jpg',
    ratings: 4.9,
    reviews: [],
    totalSold: 180,
    createdAt: new Date()
  },
  {
    title: 'The Silent Patient',
    author: ['Alex Michaelides'],
    price: 999,
    category: 'Thriller',
    stock: 65,
    tags: ['mystery', 'psychological', 'crime'],
    metadata: { pages: 336, publisher: 'Celadon Books', language: 'English' },
    description: 'A shocking psychological thriller of a woman’s act of violence against her husband.',
    image_url: 'https://covers.openlibrary.org/b/id/10439401-L.jpg',
    ratings: 4.5,
    reviews: [],
    totalSold: 350,
    createdAt: new Date()
  },
  {
    title: 'Ikigai',
    author: ['Francesc Miralles', 'Hector Garcia'],
    price: 850,
    category: 'Self-Help',
    stock: 120,
    tags: ['purpose', 'longevity', 'japanese'],
    metadata: { pages: 208, publisher: 'Penguin Books', language: 'English' },
    description: 'The Japanese Secret to a Long and Happy Life.',
    image_url: 'https://covers.openlibrary.org/b/id/10543632-L.jpg',
    ratings: 4.6,
    reviews: [],
    totalSold: 600,
    createdAt: new Date()
  },
  {
    title: 'The Psychology of Money',
    author: ['Morgan Housel'],
    price: 1099,
    category: 'Finance',
    stock: 90,
    tags: ['investing', 'wealth', 'behavioral'],
    metadata: { pages: 256, publisher: 'Harriman House', language: 'English' },
    description: 'Timeless lessons on wealth, greed, and happiness.',
    image_url: 'https://covers.openlibrary.org/b/id/10398436-L.jpg',
    ratings: 4.8,
    reviews: [],
    totalSold: 420,
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

  console.log('🌱 Database seeded successfully with Rupees!');
  process.exit(0);
}

module.exports = { seed };
