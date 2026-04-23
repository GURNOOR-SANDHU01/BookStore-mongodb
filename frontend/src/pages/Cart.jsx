import React, { useEffect, useState } from 'react';
import { ShoppingCart, Trash2, ArrowRight, Package, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, placeOrder, user, fetchCart } = useApp();
  const [placing, setPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const total = cart.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0);

  const handleOrder = async () => {
    if (!user) { navigate('/auth'); return; }
    setPlacing(true);
    const ok = await placeOrder();
    setPlacing(false);
    if (ok) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/orders');
      }, 2000);
    }
  };

  if (!user) return (
    <div className="cart-page page-enter">
      <div className="container empty-state">
        <div style={{ fontSize: '4rem' }}>🔐</div>
        <h3>Please sign in</h3>
        <p>You need to be logged in to view your cart.</p>
        <Link to="/auth" className="btn btn-primary" title="Go to login page">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="cart-page page-enter">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="order-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="success-content"
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <CheckCircle size={80} color="var(--accent-teal)" />
              <h2>Order Placed!</h2>
              <p>Your books are on the way.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        <h2>Shopping <span className="gradient-text">Cart</span></h2>
        <p className="cart-subtitle">
          MongoDB cart uses <code>$push</code> / <code>$pull</code> / <code>$inc</code> operators
        </p>

        {cart.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart size={60} color="var(--text-muted)" />
            <h3>Your cart is empty</h3>
            <p>Start adding some amazing books!</p>
            <Link to="/books" className="btn btn-primary" title="Browse available books">Browse Books</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.bookId?.toString()} className="cart-item card">
                  <img
                    src={item.book?.image_url}
                    alt={item.book?.title}
                    className="cart-item-img"
                    onError={e => e.target.src = 'https://via.placeholder.com/80x110/0c1525/4f9cf9?text=📚'}
                  />
                  <div className="cart-item-info">
                    <Link to={`/books/${item.bookId}`} className="cart-item-title" title={`View details for ${item.book?.title}`}>
                      {item.book?.title}
                    </Link>
                    <p className="cart-item-author">
                      {Array.isArray(item.book?.author) ? item.book.author.join(', ') : item.book?.author}
                    </p>
                    <div className="cart-item-meta">
                      <span className="badge badge-blue">{item.book?.category}</span>
                      <span className="cart-qty">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="cart-item-right">
                    <span className="cart-item-price">
                      ₹{((item.book?.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      className="btn btn-icon btn-ghost"
                      onClick={() => removeFromCart(item.bookId?.toString())}
                      title="Remove this item from cart"
                    >
                      <Trash2 size={16} color="var(--accent-pink)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary card">
              <h3>Order Summary</h3>
              <div className="divider" />
              {cart.map(item => (
                <div key={item.bookId?.toString()} className="summary-line">
                  <span className="summary-item-name">{item.book?.title?.slice(0, 30)}...</span>
                  <span>₹{((item.book?.price || 0) * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="divider" />
              <div className="summary-total">
                <span>Total</span>
                <span className="total-price">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-note">
                💡 Uses MongoDB <strong>transactions</strong> to atomically place order + update stock.
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleOrder}
                disabled={placing || showSuccess}
                title="Confirm and place your order"
              >
                <Package size={18} />
                {placing ? 'Placing Order...' : showSuccess ? 'Success!' : 'Place Order'}
                {!placing && !showSuccess && <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
