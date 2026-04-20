import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { useApp } from '../context/AppContext';

export default function Wishlist() {
  const { API, authHeaders, user, token } = useApp();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get(`${API}/users/wishlist`, authHeaders())
      .then(r => setBooks(r.data))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) return (
    <div style={{ padding: '140px 0 80px', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem' }}>❤️</div>
      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', margin: '16px 0 8px' }}>Your Wishlist</h3>
      <p style={{ color: 'var(--text-secondary)' }}>Please <Link to="/auth" style={{ color: 'var(--accent-blue)' }}>sign in</Link> to view your wishlist.</p>
    </div>
  );

  return (
    <div className="page-enter" style={{ padding: '100px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h2>My <span className="gradient-text">Wishlist</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            Uses MongoDB <code style={{ background: 'rgba(79,156,249,0.15)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '4px' }}>$addToSet</code> to avoid duplicates
          </p>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <Heart size={60} color="var(--text-muted)" />
            <h3>No books in your wishlist</h3>
            <p>Browse books and click the ❤️ heart to save them here.</p>
            <Link to="/books" className="btn btn-primary">Browse Books</Link>
          </div>
        ) : (
          <div className="grid grid-4">
            {books.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </div>
    </div>
  );
}
