import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from '../components/BookCard';
import { useApp } from '../context/AppContext';
import './Books.css';

export default function Books() {
  const { API } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt',
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) setFilters(f => ({ ...f, search, page: 1 }));
  }, [searchParams]);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    axios.get(`${API}/books/categories`).then(r => setCategories(['All', ...r.data]));
  }, [API]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      params.sort = filters.sort;
      params.page = filters.page;
      params.limit = 12;

      const { data } = await axios.get(`${API}/books`, { params });
      setBooks(data.books);
      setTotal(data.total);
      setPages(data.pages);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
    setSearchParams({});
  };

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  return (
    <div className="books-page page-enter">
      <div className="books-header container">
        <div>
          <h2 className="books-title">Browse <span className="gradient-text">All Books</span></h2>
          <p className="books-subtitle">{total} books found — MongoDB-powered search & filtering</p>
        </div>
        <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)} title={showFilters ? 'Hide filters' : 'Show filters'}>
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="container">
        {/* Search Bar */}
        <form className="books-search-bar" onSubmit={handleSearch}>
          <Search size={18} className="books-search-icon" />
          <input
            type="text"
            placeholder="Search by title or author using MongoDB $regex..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            className="books-search-input"
          />
          <button type="submit" className="btn btn-primary btn-sm" title="Search for books">Search</button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel card">
            <div className="filter-row">
              <div className="filter-group">
                <label className="form-label">Category</label>
                <div className="category-pills">
                  {categories.map(c => (
                      <button
                        key={c}
                        className={`pill ${filters.category === c ? 'pill-active' : ''}`}
                        onClick={() => setFilter('category', c)}
                        title={`Filter by ${c}`}
                      >
                        {c}
                      </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label className="form-label">Price Range (₹)</label>
                <div className="price-inputs">
                  <input type="number" className="form-input" placeholder="Min"
                    value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} />
                  <span>—</span>
                  <input type="number" className="form-input" placeholder="Max"
                    value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} />
                </div>
              </div>
              <div className="filter-group">
                <label className="form-label">Sort By</label>
                <select className="form-input" value={filters.sort} onChange={e => setFilter('sort', e.target.value)}>
                  <option value="createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>📚</div>
            <h3>No books found</h3>
            <p>Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-4 books-grid">
            {books.map(book => <BookCard key={book._id} book={book} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button className="btn btn-ghost btn-sm"
              disabled={filters.page <= 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>
              <ChevronLeft size={16} /> Prev
            </button>
            <span className="page-info">Page {filters.page} of {pages}</span>
            <button className="btn btn-ghost btn-sm"
              disabled={filters.page >= pages}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              title="Go to next page"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
