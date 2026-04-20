# 📚 BookStore – MongoDB-Powered Book Management System

A full-stack, aesthetically beautiful bookstore application built with:
- **Frontend**: React + Vite + Three.js (3D) + Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB (Native Driver)

## 🚀 Quick Start

### Prerequisites
- MongoDB running locally on `mongodb://localhost:27017`
- Node.js 18+

### 1. Start the Backend
```bash
cd backend
npm start
```

### 2. Seed the Database
In a new terminal:
```bash
cd backend
npm run seed
```

### 3. Start the Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`

## 🧠 MongoDB Features Demonstrated

| Feature | MongoDB Operation |
|---------|------------------|
| Book Search | `$regex`, `$options: 'i'` |
| Price Filter | `$gte`, `$lte` |
| Category Browse | `distinct()`, `find({ category })` |
| Cart Management | `$push`, `$pull`, `$inc` |
| Wishlist | `$addToSet` (no duplicates) |
| Reviews | `$push` embedded document |
| Average Rating | `$avg` aggregation |
| Order Placement | MongoDB **Transactions** |
| Stock Update | `$inc` |
| Analytics | `aggregate()` pipeline |
| Search Index | `createIndex({ title: 'text' })` |
| Pagination | `.skip().limit()` |
