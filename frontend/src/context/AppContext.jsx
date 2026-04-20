import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bs_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('bs_token') || null);
  const [cart, setCart] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const authHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  // Toast notifications
  const toast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // Auth
  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    setToken(data.token);
    setUser({ name: data.name, email: data.email, userId: data.userId });
    localStorage.setItem('bs_token', data.token);
    localStorage.setItem('bs_user', JSON.stringify({ name: data.name, email: data.email, userId: data.userId }));
    toast(`Welcome back, ${data.name}! 👋`);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
    setToken(data.token);
    setUser({ name: data.name, email: data.email, userId: data.userId });
    localStorage.setItem('bs_token', data.token);
    localStorage.setItem('bs_user', JSON.stringify({ name: data.name, email: data.email, userId: data.userId }));
    toast(`Welcome to BookStore, ${data.name}! 🎉`);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart([]);
    setCartCount(0);
    localStorage.removeItem('bs_token');
    localStorage.removeItem('bs_user');
    toast('Logged out successfully', 'info');
  };

  // Cart
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API}/users/cart`, authHeaders());
      setCart(data);
      setCartCount(data.reduce((sum, item) => sum + item.quantity, 0));
    } catch { /* silent */ }
  }, [token, authHeaders]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (bookId) => {
    if (!token) { toast('Please login to add to cart', 'info'); return; }
    try {
      await axios.post(`${API}/users/cart/add`, { bookId, quantity: 1 }, authHeaders());
      await fetchCart();
      toast('Added to cart! 🛍️');
    } catch (e) { toast(e.response?.data?.error || 'Error', 'error'); }
  };

  const removeFromCart = async (bookId) => {
    try {
      await axios.post(`${API}/users/cart/remove`, { bookId }, authHeaders());
      await fetchCart();
      toast('Removed from cart');
    } catch { toast('Error removing item', 'error'); }
  };

  const toggleWishlist = async (bookId) => {
    if (!token) { toast('Please login first', 'info'); return false; }
    try {
      const { data } = await axios.post(`${API}/users/wishlist/toggle`, { bookId }, authHeaders());
      toast(data.wishlisted ? '❤️ Added to wishlist' : 'Removed from wishlist');
      return data.wishlisted;
    } catch { return false; }
  };

  const placeOrder = async () => {
    if (!cart.length) { toast('Your cart is empty', 'info'); return; }
    try {
      const orderBooks = cart.map(item => ({ bookId: item.bookId, quantity: item.quantity }));
      await axios.post(`${API}/orders`, { books: orderBooks }, authHeaders());
      setCart([]);
      setCartCount(0);
      toast('🎉 Order placed successfully!');
      return true;
    } catch (e) {
      toast(e.response?.data?.error || 'Order failed', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      user, token, cart, cartCount, toasts,
      login, register, logout,
      addToCart, removeFromCart, fetchCart,
      toggleWishlist, placeOrder,
      toast, API, authHeaders
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
