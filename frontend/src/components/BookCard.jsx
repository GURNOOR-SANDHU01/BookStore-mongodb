import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './BookCard.css';

export default function BookCard({ book, minimal = false }) {
  const { addToCart, toggleWishlist } = useApp();

  return (
    <div className={`book-card ${minimal ? 'book-card-minimal' : ''}`}>
      <Link to={`/books/${book._id}`} className="book-cover-wrap">
        <img
          src={book.image_url}
          alt={book.title}
          className="book-cover"
          onError={e => {
            e.target.src = `https://placehold.co/200x280/EDE5D8/8B7355?text=${encodeURIComponent(book.title?.slice(0, 20) || 'Book')}`;
          }}
        />
        <div className="book-cover-actions">
          <button
            className="cover-action-btn"
            onClick={e => { e.preventDefault(); toggleWishlist(book._id); }}
            title="Add to wishlist"
          >
            <Heart size={15} strokeWidth={1.5} />
          </button>
          <button
            className="cover-action-btn cover-action-cart"
            onClick={e => { e.preventDefault(); addToCart(book._id); }}
            disabled={book.stock === 0}
            title={book.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={15} strokeWidth={1.5} />
          </button>
        </div>
        {book.stock === 0 && <span className="out-of-stock-tag">Out of Stock</span>}
      </Link>

      <div className="book-info">
        <Link to={`/books/${book._id}`} className="book-title-link">
          {book.title}
        </Link>
        {!minimal && (
          <p className="book-subtitle">
            {Array.isArray(book.author) ? book.author.join(', ') : book.author}
          </p>
        )}
        {!minimal && (
          <div className="book-bottom">
            <span className="book-price">${book.price?.toFixed(2)}</span>
            <div className="book-stars">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} strokeWidth={1}
                  fill={i <= Math.round(book.ratings) ? '#E8B84B' : 'none'}
                  color={i <= Math.round(book.ratings) ? '#E8B84B' : '#B5A08A'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
