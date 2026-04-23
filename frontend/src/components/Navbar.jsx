import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, BookOpen, User, LogOut, Heart, BarChart2, Menu, X, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, cartCount } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/books?search=${encodeURIComponent(search)}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" title="BookStore Home">
          <BookOpen size={20} strokeWidth={1.5} />
          <span>BookStore</span>
        </Link>

        {/* Center links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/books" className={`nav-link ${isActive('/books') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>Books</Link>
          {user && (
            <>
              <Link to="/wishlist" className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`} onClick={() => setMenuOpen(false)} title="View your saved books">Wishlist</Link>
              <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`} onClick={() => setMenuOpen(false)} title="View your order history">My Orders</Link>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMenuOpen(false)} title="Admin Management Dashboard">Admin</Link>
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="navbar-actions">
          <form className="navbar-search" onSubmit={handleSearch}>
            <Search size={15} className="search-icon" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>

          {user ? (
            <>
              <Link to="/cart" className="nav-icon-btn" title="Cart">
                <ShoppingCart size={18} strokeWidth={1.5} />
                {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
              </Link>
              <div className="nav-user">
                <User size={16} strokeWidth={1.5} />
                <span>{user.name.split(' ')[0]}</span>
                <button className="logout-btn" onClick={logout} title="Logout">
                  <LogOut size={15} strokeWidth={1.5} />
                </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn btn-dark btn-sm">Sign In</Link>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
