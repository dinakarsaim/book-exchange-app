// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// ---- Google Books helpers & cache (paste near top, after imports) ----
const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";
const GB_API_KEY = import.meta.env.REACT_APP_GOOGLE_BOOKS_API_KEY || ""; // optional

// simple in-memory cache for the session
const ratingsCache = new Map();

// function renderStars(rating) {
//   if (rating == null) return null;
//   const full = Math.floor(rating);
//   const half = rating - full >= 0.5;
//   const empty = 5 - full - (half ? 1 : 0);
//   return (
//     <>
//       {Array.from({ length: full }).map((_, i) => <span key={"f"+i}>★</span>)}
//       {half && <span key="half">☆</span>}
//       {Array.from({ length: empty }).map((_, i) => <span key={"e"+i}>✩</span>)}
//     </>
//   );
// }
// in Home.jsx (replace your old renderStars)
// returns React node
function renderStars(rating) {
  if (rating == null) return null;

  // clamp rating to [0,5]
  const r = Math.max(0, Math.min(5, Number(rating)));
  // build 5 stars with per-star fill %
  const stars = Array.from({ length: 5 }).map((_, i) => {
    // how much of this star should be filled (0..1)
    const fill = Math.max(0, Math.min(1, r - i));
    const fillPct = Math.round(fill * 100); // integer percent for CSS
    return (
      <span className="star" key={i} aria-hidden>
        <span className="star-top" style={{ width: `${fillPct}%` }}>★</span>
        <span className="star-bottom">★</span>
      </span>
    );
  });

  return <span className="stars-wrapper" aria-label={`Rating: ${r.toFixed(1)} out of 5`}>{stars}</span>;
}

/**
 * Query Google Books for rating.
 * book: an object; prefer book.isbn if present; otherwise title+author fallback.
 * returns number|null
 */
async function fetchRatingFromGoogle(book) {
  // cache key
  const key = book.isbn ? `isbn:${book.isbn}` : `t:${book.title}|a:${book.author}`;
  if (ratingsCache.has(key)) return ratingsCache.get(key);

  try {
    let q = "";
    if (book.isbn) {
      q = `isbn:${encodeURIComponent(book.isbn)}`;
    } else {
      // fallback to title + author (use intitle + inauthor)
      const t = book.title ? `intitle:${book.title}` : "";
      const a = book.author ? `+inauthor:${book.author}` : "";
      q = `${t}${a}`;
    }

    const params = new URLSearchParams({ q });
    if (GB_API_KEY) params.set("key", GB_API_KEY);
    // limit fields to lighten payload
    params.set("fields", "items(volumeInfo(title,authors,averageRating))");
    params.set("maxResults", "3");

    const url = `${GOOGLE_BOOKS_BASE}?${params.toString()}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      ratingsCache.set(key, null);
      return null;
    }

    const data = await resp.json();
    if (!data.items || !data.items.length) {
      ratingsCache.set(key, null);
      return null;
    }

    // pick first matching item with an averageRating
    const item = data.items.find(it => it.volumeInfo && typeof it.volumeInfo.averageRating === "number");
    const rating = item ? item.volumeInfo.averageRating : null;
    ratingsCache.set(key, rating);
    return rating;
  } catch (err) {
    console.error("Google Books fetch error", err);
    ratingsCache.set(key, null);
    return null;
  }
}

const Home = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useQuery();
  const qParam = query.get("q") || null;       // search text from URL
  const genreParam = query.get("genre") || null; // optional: allow genre via URL

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch (e) {
      userId = null;
    }
  }

  // const fetchBooks = async ({ genre = null, q = null } = {}) => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     const params = new URLSearchParams();
  //     if (genre) params.set("genre", genre);
  //     if (q) params.set("q", q);
  //     const url = params.toString() ? `/books?${params.toString()}` : "/books";
  //     const res = await API.get(url);
  //     setBooks(res.data || []);
  //   } catch (err) {
  //     console.error(err);
  //     setError("Failed to load books");
  //     setBooks([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBooks = async ({ genre = null, q = null } = {}) => {
  setLoading(true);
  setError("");

  try {
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (q) params.set("q", q);
    const url = params.toString() ? `/books?${params.toString()}` : "/books";

    const res = await API.get(url); // your axios instance
    const fetched = res.data || [];

    if (!fetched.length) {
      setBooks([]);
      setLoading(false);
      return;
    }

    // fetch ratings in parallel (small batch). Use Promise.all but you can later add concurrency limit if needed.
    const ratingPromises = fetched.map(b => fetchRatingFromGoogle(b));
    const ratings = await Promise.all(ratingPromises); // array of number|null

    // merge rating into books
    const merged = fetched.map((b, i) => ({ ...b, rating: ratings[i] }));
    setBooks(merged);
  } catch (err) {
    console.error(err);
    setError("Failed to load books");
    setBooks([]);
  } finally {
    setLoading(false);
  }
};

  // sync selectedGenre with genreParam in URL (so sidebar reflects url filter)
  useEffect(() => {
    if (genreParam) setSelectedGenre(genreParam);
    // don't overwrite selectedGenre if nothing in url
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genreParam]);

  // fetch books whenever query or selected genre changes
  useEffect(() => {
    // prefer qParam and genreParam from URL; also use local selectedGenre if present
    const genreToUse = genreParam || selectedGenre;
    fetchBooks({ genre: genreToUse, q: qParam });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam, genreParam, selectedGenre]);

  const handleRequest = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Please login first."); return; }
      await API.post("/requests", { bookId }, { headers: { Authorization: `Bearer ${token}` }});
      alert("Request sent!");
    } catch (err) {
      console.error("Request failed:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error sending request");
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="app-layout" style={{ display: "flex", gap: 28, padding: 0 }}>
        <Sidebar selectedGenre={selectedGenre} onSelectGenre={(g) => {
          setSelectedGenre(g);
          // update URL's genre param so search + genre are preserved in URL
          const params = new URLSearchParams();
          const curQ = qParam;
          if (curQ) params.set("q", curQ);
          if (g) params.set("genre", g);
          // navigate is not available here; instead push to history by updating location:
          // we can use window.location or better approach is to use navigate from react-router,
          // but to keep this component simple, update URL without reloading:
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.pushState({}, "", newUrl);
          // then fetchBooks will run when genreParam/selectedGenre changes (effect above)
        }} />

        <main className="main-content" style={{ flex: 1 }}>
          <Navbar />
          <h1 className="page-header">
            {qParam ? `Search: "${qParam}"` : `Available Books ${selectedGenre ? `— ${selectedGenre}` : ""}`}
          </h1>

          {loading && <p className="fallback">Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="grid">
            {books.map((book) => (
              <div className="card" key={book._id}>
                {book.image ? <img src={book.image} alt={book.title} /> : <div className="cover placeholder" />}
                <h2 className="book-name">{book.title}</h2>
                <p><strong></strong> {book.author}</p>
                <p><strong>By:</strong> {book.owner?.name || "Unknown"}</p>

                <div className="rating">
                  {book.rating == null ? (
                    <span className="rating-none">—</span>
                  ) : (
                    <>
                      <span className="rating-stars">{renderStars(book.rating)}</span>
                      <span className="rating-number">{book.rating.toFixed(1)}</span>
                    </>
                  )}
                </div>

                {userId && userId !== String(book.owner?._id || book.owner) && (
                  <button className="plus-btn" onClick={() => handleRequest(book._id)} aria-label="request">+</button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;