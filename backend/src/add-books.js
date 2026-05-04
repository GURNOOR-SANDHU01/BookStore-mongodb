require('dotenv').config({ path: '../.env' });
const { getDB, connectDB } = require('./db');

const NEW_BOOKS = [
  // HARRY POTTER
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: ['J.K. Rowling'],
    price: 1450,
    category: 'Fantasy',
    stock: 85,
    tags: ['magic', 'young-adult', 'adventure', 'hogwarts'],
    metadata: { pages: 341, publisher: 'Scholastic', language: 'English' },
    description: 'Harry returns to Hogwarts for his second year, but a mysterious chamber has been opened.',
    image_url: 'https://covers.openlibrary.org/b/id/10314545-L.jpg',
    ratings: 4.8,
    reviews: [],
    totalSold: 450,
    createdAt: new Date()
  },
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    author: ['J.K. Rowling'],
    price: 1550,
    category: 'Fantasy',
    stock: 90,
    tags: ['magic', 'young-adult', 'adventure', 'hogwarts'],
    metadata: { pages: 435, publisher: 'Scholastic', language: 'English' },
    description: 'An escaped prisoner from Azkaban is on the loose, and Harry is his target.',
    image_url: 'https://covers.openlibrary.org/b/id/10521270-L.jpg',
    ratings: 4.9,
    reviews: [],
    totalSold: 480,
    createdAt: new Date()
  },
  {
    title: 'Harry Potter and the Goblet of Fire',
    author: ['J.K. Rowling'],
    price: 1750,
    category: 'Fantasy',
    stock: 75,
    tags: ['magic', 'young-adult', 'adventure', 'hogwarts'],
    metadata: { pages: 734, publisher: 'Scholastic', language: 'English' },
    description: 'Harry competes in the dangerous Triwizard Tournament.',
    image_url: 'https://covers.openlibrary.org/b/id/10582295-L.jpg',
    ratings: 4.8,
    reviews: [],
    totalSold: 420,
    createdAt: new Date()
  },
  {
    title: 'Harry Potter and the Order of the Phoenix',
    author: ['J.K. Rowling'],
    price: 1850,
    category: 'Fantasy',
    stock: 60,
    tags: ['magic', 'young-adult', 'adventure', 'hogwarts'],
    metadata: { pages: 870, publisher: 'Scholastic', language: 'English' },
    description: 'Harry forms a secret group to defend against the dark arts as Voldemort returns.',
    image_url: 'https://covers.openlibrary.org/b/id/10617305-L.jpg',
    ratings: 4.7,
    reviews: [],
    totalSold: 400,
    createdAt: new Date()
  },
  {
    title: 'Harry Potter and the Half-Blood Prince',
    author: ['J.K. Rowling'],
    price: 1800,
    category: 'Fantasy',
    stock: 70,
    tags: ['magic', 'young-adult', 'adventure', 'hogwarts'],
    metadata: { pages: 652, publisher: 'Scholastic', language: 'English' },
    description: 'Harry learns more about Voldemort\'s past and prepares for the final battle.',
    image_url: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTUZpMVSaIl-BWuTS4vf3kACrBgSq697MspdvL4BpzA6iRopeSOlCHaXdoKcwdUg0hm6LuNIBo',
    ratings: 4.9,
    reviews: [],
    totalSold: 460,
    createdAt: new Date()
  },
  {
    title: 'Harry Potter and the Deathly Hallows',
    author: ['J.K. Rowling'],
    price: 1950,
    category: 'Fantasy',
    stock: 95,
    tags: ['magic', 'young-adult', 'adventure', 'hogwarts'],
    metadata: { pages: 759, publisher: 'Scholastic', language: 'English' },
    description: 'The final battle between Harry Potter and Lord Voldemort.',
    image_url: 'https://covers.openlibrary.org/b/id/10582297-L.jpg',
    ratings: 4.9,
    reviews: [],
    totalSold: 550,
    createdAt: new Date()
  },

  // PERCY JACKSON
  {
    title: 'The Lightning Thief',
    author: ['Rick Riordan'],
    price: 1299,
    category: 'Fantasy',
    stock: 120,
    tags: ['mythology', 'young-adult', 'adventure'],
    metadata: { pages: 377, publisher: 'Disney Hyperion', language: 'English' },
    description: 'Percy Jackson discovers he is a demigod and must find Zeus\'s stolen lightning bolt.',
    image_url: 'https://covers.openlibrary.org/b/id/12613589-L.jpg',
    ratings: 4.8,
    reviews: [],
    totalSold: 380,
    createdAt: new Date()
  },
  {
    title: 'The Sea of Monsters',
    author: ['Rick Riordan'],
    price: 1250,
    category: 'Fantasy',
    stock: 110,
    tags: ['mythology', 'young-adult', 'adventure'],
    metadata: { pages: 279, publisher: 'Disney Hyperion', language: 'English' },
    description: 'Percy and his friends must journey into the Sea of Monsters to save their camp.',
    image_url: 'https://covers.openlibrary.org/b/id/12624508-L.jpg',
    ratings: 4.6,
    reviews: [],
    totalSold: 340,
    createdAt: new Date()
  },
  {
    title: 'The Titan\'s Curse',
    author: ['Rick Riordan'],
    price: 1250,
    category: 'Fantasy',
    stock: 95,
    tags: ['mythology', 'young-adult', 'adventure'],
    metadata: { pages: 312, publisher: 'Disney Hyperion', language: 'English' },
    description: 'Percy must rescue the goddess Artemis and his friend Annabeth.',
    image_url: 'https://covers.openlibrary.org/b/id/12624510-L.jpg',
    ratings: 4.7,
    reviews: [],
    totalSold: 320,
    createdAt: new Date()
  },
  {
    title: 'The Battle of the Labyrinth',
    author: ['Rick Riordan'],
    price: 1350,
    category: 'Fantasy',
    stock: 85,
    tags: ['mythology', 'young-adult', 'adventure'],
    metadata: { pages: 361, publisher: 'Disney Hyperion', language: 'English' },
    description: 'Percy and his friends must navigate the deadly Labyrinth to stop an invasion.',
    image_url: 'https://covers.openlibrary.org/b/id/12624513-L.jpg',
    ratings: 4.8,
    reviews: [],
    totalSold: 350,
    createdAt: new Date()
  },
  {
    title: 'The Last Olympian',
    author: ['Rick Riordan'],
    price: 1450,
    category: 'Fantasy',
    stock: 100,
    tags: ['mythology', 'young-adult', 'adventure'],
    metadata: { pages: 381, publisher: 'Disney Hyperion', language: 'English' },
    description: 'The final battle to save Mount Olympus from the Titan Lord Kronos.',
    image_url: 'https://covers.openlibrary.org/b/id/12624516-L.jpg',
    ratings: 4.9,
    reviews: [],
    totalSold: 410,
    createdAt: new Date()
  },

  // DISNEY
  {
    title: 'Beauty and the Beast: Lost in a Book',
    author: ['Jennifer Donnelly'],
    price: 1150,
    category: 'Fiction',
    stock: 60,
    tags: ['disney', 'fantasy', 'romance'],
    metadata: { pages: 352, publisher: 'Disney Press', language: 'English' },
    description: 'An original story set in the world of the live-action Beauty and the Beast film.',
    image_url: 'https://covers.openlibrary.org/b/id/12660057-L.jpg',
    ratings: 4.4,
    reviews: [],
    totalSold: 210,
    createdAt: new Date()
  },
  {
    title: 'A Twisted Tale: A Whole New World',
    author: ['Liz Braswell'],
    price: 1050,
    category: 'Fiction',
    stock: 75,
    tags: ['disney', 'fantasy', 'alternative-history'],
    metadata: { pages: 384, publisher: 'Disney-Hyperion', language: 'English' },
    description: 'What if Jafar was the first one to summon the Genie?',
    image_url: 'https://covers.openlibrary.org/b/id/12470716-L.jpg',
    ratings: 4.5,
    reviews: [],
    totalSold: 250,
    createdAt: new Date()
  },
  {
    title: 'The Lion King: The Novelization',
    author: ['Elizabeth Rudnick'],
    price: 950,
    category: 'Fiction',
    stock: 50,
    tags: ['disney', 'animals', 'adventure'],
    metadata: { pages: 256, publisher: 'Disney Press', language: 'English' },
    description: 'The novelization of the classic animated film The Lion King.',
    image_url: 'https://covers.openlibrary.org/b/id/12711105-L.jpg',
    ratings: 4.6,
    reviews: [],
    totalSold: 180,
    createdAt: new Date()
  },
  {
    title: 'Disney Villains: Fairest of All',
    author: ['Serena Valentino'],
    price: 1250,
    category: 'Fiction',
    stock: 65,
    tags: ['disney', 'fantasy', 'villains'],
    metadata: { pages: 256, publisher: 'Disney Press', language: 'English' },
    description: 'The story of how the Evil Queen became so evil.',
    image_url: 'https://covers.openlibrary.org/b/id/10243455-L.jpg',
    ratings: 4.5,
    reviews: [],
    totalSold: 220,
    createdAt: new Date()
  },
  {
    title: 'Aladdin: Far From Agrabah',
    author: ['Aisha Saeed'],
    price: 1100,
    category: 'Fiction',
    stock: 45,
    tags: ['disney', 'fantasy', 'adventure'],
    metadata: { pages: 304, publisher: 'Disney Press', language: 'English' },
    description: 'An original story set in the world of the live-action Aladdin film.',
    image_url: 'https://covers.openlibrary.org/b/id/10255555-L.jpg',
    ratings: 4.3,
    reviews: [],
    totalSold: 150,
    createdAt: new Date()
  }
];

async function addBooks() {
  try {
    await connectDB();
    const db = getDB();
    const books = db.collection('books');
    
    const result = await books.insertMany(NEW_BOOKS);
    console.log(`✅ Successfully added ${result.insertedCount} new books (Harry Potter, Percy Jackson, Disney)`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to add books:', err);
    process.exit(1);
  }
}

addBooks();
