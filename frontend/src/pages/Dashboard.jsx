import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart2, TrendingUp, ShoppingBag, BookOpen, Plus, Edit, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="dash-stat card">
      <div className="dash-stat-icon" style={{ background: `rgba(${color}, 0.15)`, color: `rgb(${color})` }}>
        <Icon size={22} />
      </div>
      <div>
        <div className="dash-stat-value">{value}</div>
        <div className="dash-stat-label">{label}</div>
      </div>
    </div>
  );
}

const EMPTY_BOOK = { title: '', author: '', price: '', category: '', stock: '', description: '', image_url: '' };

export default function Dashboard() {
  const { API, authHeaders, token, user } = useApp();
  const [analytics, setAnalytics] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState(EMPTY_BOOK);
  const [saving, setSaving] = useState(false);
  const { toast } = useApp();

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  const load = async () => {
    setLoading(true);
    try {
      const [analyticsRes, booksRes] = await Promise.all([
        axios.get(`${API}/orders/analytics`, authHeaders()),
        axios.get(`${API}/books?limit=50`)
      ]);
      setAnalytics(analyticsRes.data);
      setBooks(booksRes.data.books);
    } catch { /* silent */ }
    setLoading(false);
  };

  const openAdd = () => { setEditBook(null); setForm(EMPTY_BOOK); setShowModal(true); };
  const openEdit = (book) => {
    setEditBook(book);
    setForm({
      title: book.title, author: Array.isArray(book.author) ? book.author.join(', ') : book.author,
      price: book.price, category: book.category, stock: book.stock,
      description: book.description, image_url: book.image_url || ''
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, author: [form.author], price: parseFloat(form.price), stock: parseInt(form.stock) };
      if (editBook) {
        await axios.put(`${API}/books/${editBook._id}`, payload, authHeaders());
        toast('Book updated! ✅');
      } else {
        await axios.post(`${API}/books`, payload, authHeaders());
        toast('Book added! 🎉');
      }
      setShowModal(false);
      load();
    } catch (e) { toast(e.response?.data?.error || 'Error', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axios.delete(`${API}/books/${id}`, authHeaders());
      toast('Book deleted');
      load();
    } catch { toast('Error deleting', 'error'); }
  };

  if (!user) return (
    <div className="dashboard page-enter">
      <div className="container empty-state">
        <div style={{ fontSize: '3rem' }}>🔐</div>
        <h3>Admin Access Required</h3>
        <p>Please sign in to access the dashboard.</p>
      </div>
    </div>
  );

  return (
    <div className="dashboard page-enter">
      <div className="container">
        <div className="dash-header">
          <div>
            <h2>Admin <span className="gradient-text">Dashboard</span></h2>
            <p className="dash-subtitle">MongoDB Aggregation Pipeline Analytics</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd} title="Add a new book to the catalog">
            <Plus size={18} /> Add Book
          </button>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="dash-stats-grid">
              <StatCard icon={TrendingUp} label="Total Revenue"
                value={`₹${analytics?.revenue?.totalRevenue?.toLocaleString('en-IN') || '0'}`}
                color="79, 156, 249" />
              <StatCard icon={ShoppingBag} label="Total Orders"
                value={analytics?.revenue?.totalOrders || 0}
                color="139, 92, 246" />
              <StatCard icon={BookOpen} label="Books in Catalog"
                value={books.length}
                color="20, 184, 166" />
              <StatCard icon={BarChart2} label="Top Seller"
                value={analytics?.topSelling?.[0]?.title?.slice(0, 20) + '...' || '—'}
                color="245, 158, 11" />
            </div>

            {/* Top Selling Books (Aggregation) */}
            {analytics?.topSelling?.length > 0 && (
              <div className="dash-section">
                <h3>🏆 Top Selling Books <span className="mongo-tag">aggregate()</span></h3>
                <div className="top-selling-list">
                  {analytics.topSelling.map((b, i) => (
                    <div key={b._id?.toString()} className="top-book card">
                      <span className="top-rank">#{i + 1}</span>
                      <div className="top-info">
                        <div className="top-title">{b.title}</div>
                        <div className="top-meta">{b.totalSold} sold • Revenue: ₹{b.revenue?.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="top-bar-wrap">
                        <div
                          className="top-bar"
                          style={{ width: `${Math.min(100, (b.totalSold / (analytics.topSelling[0]?.totalSold || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventory Management */}
            <div className="dash-section">
              <h3>📦 Inventory Management <span className="mongo-tag">insertOne / updateOne / deleteOne</span></h3>
              <div className="inventory-table card">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book._id?.toString()}>
                        <td className="book-name-cell">
                          <img
                            src={book.image_url}
                            alt=""
                            className="table-book-img"
                            onError={e => e.target.style.display = 'none'}
                          />
                          <span>{book.title}</span>
                        </td>
                        <td><span className="badge badge-blue">{book.category}</span></td>
                        <td>₹{book.price?.toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`stock-indicator ${book.stock <= 5 ? 'low' : 'ok'}`}>
                            {book.stock}
                          </span>
                        </td>
                        <td>⭐ {book.ratings?.toFixed(1)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(book)}>
                              <Edit size={14} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(book._id, book.title)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box card">
            <div className="modal-header">
              <h3>{editBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button className="btn btn-icon btn-ghost" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="modal-grid">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Author *</label>
                  <input className="form-input" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" type="number" step="1" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <input className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input className="form-input" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input className="form-input" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
