import React, { useEffect, useState } from "react";
import API from "../services/api";
import {jwtDecode} from "jwt-decode";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await API.get("/books");
        setBooks(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleRequest = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first.");
        return;
      }

      await API.post("/requests", { bookId });
      alert("Request sent!");
    } catch (err) {
      console.error("Request failed:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Error sending request");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📚 Available Books</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "grid", gap: "1rem" }}>
        {books.map((book) => (
          <div
            key={book._id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {book.image && (
              <img
                src={book.image}
                alt={book.title}
                style={{ width: "100px", height: "auto", marginBottom: "1rem" }}
              />
            )}
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Posted by:</strong> {book.owner?.name || "Unknown"}</p>
            {userId && userId !== book.owner._id && (
              <button
                onClick={() => handleRequest(book._id)}
                style={{ marginTop: "10px", padding: "5px 10px" }}
              >
                Request Book
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;