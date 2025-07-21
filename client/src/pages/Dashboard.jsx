import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await API.get("books/my-books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err.message);
        setError("Could not load books.");
      }
    };

    fetchBooks();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.error("Error deleting book:", err.message);
      alert("Failed to delete book.");
    }
  };

  return (
    <div className="container">
      <h1>Your Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="grid">
        {books.map((book) => (
          <div className="card" key={book._id}>
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            {book.image && <img className="bookie" src={book.image} alt={book.title} />}
            <p>{book.description}</p>
            <button onClick={() => handleDelete(book._id)} style={{ backgroundColor: "red" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;