import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { useApp } from '../context/AppContext';
import heroBg from '../assets/hero_bg.png';
import './Home.css';

// ──────────────────────────────────────────────
// SECTION: Hero
// ──────────────────────────────────────────────
function HeroSection({ featuredBooks }) {
  return (
    <section className="hero-section">
      <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="hero-overlay" />
      <div className="container hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">Welcome to BookStore</span>
          <h1 className="hero-title">
            Stories Worth<br />
            <em>Reading Again</em>
          </h1>
          <p className="hero-desc">
            Discover heartwarming stories about families without boundaries.
            Named Best Books of the Year by Library Journal.
          </p>
          <div className="hero-ctas">
            <Link to="/books" className="btn btn-gold btn-lg">
              Browse All Books <ArrowRight size={16} strokeWidth={2} />
            </Link>
            <Link to="/auth" className="btn btn-outline btn-lg">
              Join Our Community
            </Link>
          </div>
        </div>

        {featuredBooks.length > 0 && (
          <div className="hero-books">
            {featuredBooks.slice(0, 3).map((book, i) => (
              <div key={book._id} className={`hero-book hero-book-${i}`}>
                <Link to={`/books/${book._id}`}>
                  <img
                    src={book.image_url}
                    alt={book.title}
                    onError={e => e.target.src = `https://placehold.co/160x230/EDE5D8/8B7355?text=Book`}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// SECTION: Books Discover
// ──────────────────────────────────────────────
function BooksSection({ books }) {
  const [start, setStart] = useState(0);
  const visible = 4;
  const canPrev = start > 0;
  const canNext = start + visible < books.length;

  return (
    <section className="books-section section">
      <div className="container">
        <div className="books-section-header">
          <div className="books-section-left">
            <span className="section-label">Books</span>
            <h2>Discover all our books<br />you were looking for</h2>
          </div>
          <div className="books-section-right">
            <p>Explore hundreds of heartwarming stories about families without boundaries.</p>
            <Link to="/books" className="btn btn-gold">View All Books</Link>
            <div className="slider-arrows">
              <button className="arrow-btn" disabled={!canPrev} onClick={() => setStart(s => Math.max(0, s - 1))}>
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button className="arrow-btn" disabled={!canNext} onClick={() => setStart(s => Math.min(books.length - visible, s + 1))}>
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="books-slider-grid">
          {books.slice(start, start + visible).map(book => (
            <BookCard key={book._id} book={book} minimal />
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// SECTION: About Me
// ──────────────────────────────────────────────
function AboutSection() {
  return (
    <section className="about-section section">
      <div className="container">
        <div className="about-inner">
          <div className="about-content">
            <span className="section-label">About Me</span>
            <h2>BookStore: Stories of<br />Love, Laughter, and Legacy</h2>
            <p>
              USA Today bestselling bookstore curating hilarious & heartwarming stories
              about families without boundaries. Our books have been named Best Books of the
              Year by Library Journal, NPR, the Washington Post, and Kirkus.
            </p>
            <p>
              We've won the American Library Association's award for best in genre, the RT Reviewer
              Choice Award, and multiple RT Seals of Excellence.
            </p>
            <Link to="/books" className="btn btn-gold">About BookStore</Link>
          </div>
          <div className="about-image-wrap">
            <div className="about-image-inner">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80"
                alt="Reading books"
                className="about-img"
              />
              <div className="about-img-decoration" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// SECTION: Testimonials Slider
// ──────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "A sparkling page-turner about the unbreakable bonds of women and the necessity of forging an authentic path. Dev's storytelling shines!",
    author: "—Kristy Woodson Harvey, New York Times bestselling author of The Wedding Veil"
  },
  {
    quote: "Warm, funny, and profoundly human. These books remind us why stories matter and why families — in all their chaos — are worth celebrating.",
    author: "—NPR Books, Best Books of the Year"
  },
  {
    quote: "An absolute treasure from first page to last. This bookstore consistently delivers books that stay with you long after you've turned the final page.",
    author: "—Library Journal, Starred Review"
  }
];

function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const t = TESTIMONIALS[idx];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonial-inner">
          <button
            className="testi-arrow"
            onClick={() => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <div className="testimonial-body">
            <blockquote>"{t.quote}"</blockquote>
            <cite>{t.author}</cite>
            <div className="testi-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`testi-dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} />
              ))}
            </div>
          </div>
          <button
            className="testi-arrow"
            onClick={() => setIdx(i => (i + 1) % TESTIMONIALS.length)}
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// SECTION: Podcasts (Lit With Love style)
// ──────────────────────────────────────────────
const PODCASTS = [
  {
    title: "Tracy Brogan on Great Books",
    thumb: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=75",
    featured: true
  },
  {
    title: "Sally Kilpatrick on Reading",
    thumb: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400&q=75",
    featured: false
  },
  {
    title: "Brenda Novak on Fiction",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=75",
    featured: false
  }
];

function PodcastsSection() {
  return (
    <section className="podcasts-section section">
      <div className="container">
        <div className="section-header-center">
          <span className="section-label">Podcasts</span>
          <h2>Lit With Love</h2>
        </div>
        <div className="podcasts-grid">
          <div className="podcast-featured">
            <div className="podcast-thumb">
              <img src={PODCASTS[0].thumb} alt={PODCASTS[0].title} />
              <div className="play-overlay">
                <Play size={28} fill="white" color="white" />
              </div>
              <div className="podcast-featured-caption">{PODCASTS[0].title}</div>
            </div>
          </div>
          <div className="podcast-aside">
            <div className="podcast-smalls">
              {PODCASTS.slice(1).map(p => (
                <div key={p.title} className="podcast-small-card">
                  <div className="podcast-small-thumb">
                    <img src={p.thumb} alt={p.title} />
                    <div className="play-overlay play-sm">
                      <Play size={18} fill="white" color="white" />
                    </div>
                  </div>
                  <p>{p.title}</p>
                </div>
              ))}
            </div>
            <p className="podcast-desc">
              Join us for conversations about great books, heartwarming stories, and the writers who bring them to life.
            </p>
            <Link to="/books" className="btn btn-gold">View All Podcasts</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// SECTION: Newsletter
// ──────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <section className="newsletter-section section">
      <div className="container">
        <div className="newsletter-inner">
          <div className="newsletter-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80"
              alt="Books"
              className="newsletter-img"
            />
          </div>
          <div className="newsletter-content">
            <h2>Subscribe to My<br />Newsletter</h2>
            <p>
              Sign up to receive our 3Rs newsletters: a Recipe, a Recommendation, and a 
              Really bad joke! Also, get a free recipe book for signing up.
            </p>
            {subscribed ? (
              <div className="subscribed-msg">
                🎉 Thank you for subscribing!
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Your Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-gold">Subscribe</button>
              </form>
            )}
          </div>
          <div className="newsletter-leaf-deco">❧</div>
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// SECTION: Available On
// ──────────────────────────────────────────────
const PLATFORMS = [
  { name: 'amazon', label: 'amazon' },
  { name: 'apple', label: '🍎 Books' },
  { name: 'bn', label: 'Barnes & Noble' },
  { name: 'bookshop', label: '📖 Bookshop.org' },
  { name: 'kobo', label: 'kobo' },
  { name: 'ab', label: 'audiobooks' },
];

function PlatformsSection() {
  return (
    <section className="platforms-section">
      <div className="container">
        <h3 className="platforms-title">Books Are Available On</h3>
        <div className="platforms-grid">
          {PLATFORMS.map(p => (
            <div key={p.name} className="platform-item">
              <span>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────
// SECTION: Footer
// ──────────────────────────────────────────────
function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">BookStore</div>
            <p>
              We curate hilarious & heartwarming stories about families without boundaries. 
              Our books have been named Best Books of the Year by Library Journal.
            </p>
            <div className="footer-socials">
              <span>f</span><span>ig</span><span>x</span><span>yt</span>
            </div>
          </div>
          <div className="footer-links">
            <h4>Useful Links</h4>
            <ul>
              {['Home', 'About', 'Books', 'Podcast', 'Contact'].map(l => (
                <li key={l}><Link to="/">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-newsletter">
            <h4>Subscribe to Newsletter</h4>
            <form onSubmit={e => { e.preventDefault(); setEmail(''); }}>
              <input
                type="email"
                className="form-input"
                placeholder="Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 BookStore — All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────
// MAIN HOME PAGE
// ──────────────────────────────────────────────
export default function Home() {
  const { API } = useApp();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/books?limit=8&sort=rating`)
      .then(r => setBooks(r.data.books))
      .finally(() => setLoading(false));
  }, [API]);

  return (
    <div className="home-page page-enter">
      <HeroSection featuredBooks={books.slice(0, 3)} />
      {!loading && <BooksSection books={books} />}
      <AboutSection />
      <TestimonialsSection />
      <PodcastsSection />
      <NewsletterSection />
      <PlatformsSection />
      <Footer />
    </div>
  );
}
