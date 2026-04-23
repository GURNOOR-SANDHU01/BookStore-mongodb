import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const STATUS_ICONS = { pending: Clock, confirmed: CheckCircle, cancelled: XCircle };
const STATUS_COLORS = { pending: 'badge-gold', confirmed: 'badge-teal', cancelled: 'badge-pink' };

export default function Orders() {
  const { API, authHeaders, token, user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get(`${API}/orders/my`, authHeaders())
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) return (
    <div style={{ padding: '140px 0 80px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Please <Link to="/auth" style={{ color: 'var(--accent-blue)' }}>sign in</Link> to view your orders.</p>
    </div>
  );

  return (
    <div className="page-enter" style={{ padding: '100px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h2>My <span className="gradient-text">Orders</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
            Placed using MongoDB <code style={{ background: 'rgba(79,156,249,0.15)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '4px' }}>transactions</code> + atomic <code style={{ background: 'rgba(79,156,249,0.15)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '4px' }}>$inc</code> stock update
          </p>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <Package size={60} color="var(--text-muted)" />
            <h3>No orders yet</h3>
            <p>Place your first order from the cart!</p>
            <Link to="/books" className="btn btn-primary" title="Go back to library to shop more">Browse Books</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map(order => {
              const StatusIcon = STATUS_ICONS[order.status] || Clock;
              return (
                <div key={order._id?.toString()} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Order #{order._id?.toString().slice(-8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span className={`badge ${STATUS_COLORS[order.status] || 'badge-blue'}`}>
                        <StatusIcon size={11} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {order.status}
                      </span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        ₹{order.total_price?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {order.books?.map((b, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)', padding: '8px 14px'
                      }}>
                        <BookOpen size={14} color="var(--accent-blue)" />
                        <span style={{ fontSize: '0.85rem' }}>{b.title}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>×{b.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
