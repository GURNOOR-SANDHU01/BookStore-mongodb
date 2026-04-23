import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Auth.css';

export default function Auth() {
  const { login, register, toast } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { toast('Name is required', 'error'); setLoading(false); return; }
        await register(form.name, form.email, form.password);
      }
      navigate('/books');
    } catch (err) {
      toast(err.response?.data?.error || 'Authentication failed', 'error');
    }
    setLoading(false);
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="auth-page page-enter">
      <div className="auth-bg-orb auth-bg-orb-1" />
      <div className="auth-bg-orb auth-bg-orb-2" />

      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo">
            <BookOpen size={32} />
          </div>
          <h2>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p>{isLogin ? 'Sign in to your BookStore account' : 'Join thousands of book lovers'}</p>
        </div>

        {/* Toggle */}
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input input-with-icon"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input input-with-icon"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input input-with-icon input-with-right-icon"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setField('password', e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="input-right-btn"
                onClick={() => setShowPass(!showPass)}
                title={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading} title={isLogin ? 'Sign in to account' : 'Create new account'}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button className="link-btn" onClick={() => setIsLogin(!isLogin)} title={isLogin ? 'Switch to Sign Up' : 'Switch to Sign In'}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        {/* Demo credentials */}
        <div className="demo-creds">
          <p>💡 <strong>Demo:</strong> Register a new account to get started instantly.</p>
        </div>
      </div>
    </div>
  );
}
