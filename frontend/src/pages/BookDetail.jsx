import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { ShoppingCart, Heart, Star, ArrowLeft, BookOpen, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './BookDetail.css';

function Book3D({ color = '#4f9cf9' }) {
  return (
    <Float speed={2} floatIntensity={1}>
      <mesh castShadow>
        <boxGeometry args={[2, 3, 0.4]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.22]}>
        <boxGeometry args={[1.8, 2.8, 0.02]} />
        <meshStandardMaterial color="#ffffff" metalness={0} roughness={1} opacity={0.15} transparent />
      </mesh>
    </Float>
  );
}

const BOOK_COLORS = ['#4f9cf9', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

function Stars({ rating, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="stars star-interactive">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={22}
          fill={i <= (hovered || Math.round(rating)) ? '#f59e0b' : 'none'}
          color={i <= (hovered || Math.round(rating)) ? '#f59e0b' : '#4a5568'}
          className="star-btn"
          onMouseEnter={() => onChange && setHovered(i)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange && onChange(i)}
        />
      ))}
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const { API, addToCart, toggleWishlist, token, user, toast } = useApp();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [bookColor] = useState(BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)]);

  useEffect(() => {
    axios.get(`${API}/books/${id}`)
      .then(r => setBook(r.data))
      .catch(() => navigate('/books'))
      .finally(() => setLoading(false));
  }, [id, API, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) { toast('Please login to leave a review', 'info'); return; }
    if (!review.comment.trim()) { toast('Please write a comment', 'info'); return; }
    setSubmitting(true);
    try {
      await axios.post(`${API}/books/${id}/review`, {
        ...review,
        user: user.name
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast('Review submitted! 🌟');
      // Reload book to see new review
      const { data } = await axios.get(`${API}/books/${id}`);
      setBook(data);
      setReview({ rating: 5, comment: '' });
    } catch (e) {
      toast(e.response?.data?.error || 'Error submitting review', 'error');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!book) return null;

  return (
    <div className="book-detail page-enter">
      <div className="container">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="detail-main">
          {/* 3D Book Model */}
          <div className="detail-3d-wrap">
            <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[5, 5, 5]} intensity={1} color="#4f9cf9" />
              <pointLight position={[-5, -5, 5]} intensity={0.5} color="#8b5cf6" />
              <Book3D color={bookColor} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
            </Canvas>
            <p className="canvas-hint">🖱️ Drag to rotate</p>
          </div>

          {/* Book Info */}
          <div className="detail-info">
            <span className="badge badge-blue">{book.category}</span>
            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">by {Array.isArray(book.author) ? book.author.join(', ') : book.author}</p>

            <div className="detail-rating">
              <Stars rating={book.ratings} />
              <span className="rating-count">({book.reviews?.length || 0} reviews)</span>
            </div>

            <p className="detail-description">{book.description}</p>

            <div className="detail-meta">
              <div className="meta-item">
                <Package size={16} />
                <span>{book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}</span>
              </div>
              <div className="meta-item">
                <BookOpen size={16} />
                <span>{book.totalSold || 0} sold</span>
              </div>
            </div>

            <div className="detail-price">₹{book.price?.toLocaleString('en-IN')}</div>

            <div className="detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => addToCart(book._id)}
                disabled={book.stock === 0}
                title={book.stock === 0 ? 'Out of stock' : 'Add this book to your cart'}
              >
                <ShoppingCart size={20} />
                {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
               <button
                className="btn btn-ghost btn-lg"
                onClick={() => toggleWishlist(book._id)}
                title="Add to your personal wishlist"
              >
                <Heart size={20} />
                Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Reviews <span className="gradient-text">& Ratings</span></h2>

          {book.reviews?.length > 0 ? (
            <div className="reviews-list">
              {book.reviews.map((r, i) => (
                <div key={i} className="review-card card">
                  <div className="review-header">
                    <div className="reviewer-avatar">{r.user?.[0]?.toUpperCase()}</div>
                    <div>
                      <div className="reviewer-name">{r.user}</div>
                      <Stars rating={r.rating} />
                    </div>
                    <span className="review-date">
                      {r.date ? new Date(r.date).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ minHeight: '120px' }}>
              <p>No reviews yet. Be the first! 🌟</p>
            </div>
          )}

          {/* Add Review */}
          <div className="add-review card">
            <h3>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <Stars rating={review.rating} onChange={r => setReview(rv => ({ ...rv, rating: r }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Share your thoughts about this book..."
                  value={review.comment}
                  onChange={e => setReview(rv => ({ ...rv, comment: e.target.value }))}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : '🌟 Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
