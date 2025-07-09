// import { useEffect, useState } from "react";
// import API from "../services/api";
// import { useNavigate } from "react-router-dom";

// function Dashboard() {
//   const [books, setBooks] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBooks = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const res = await API.get("books/my-books");
//         setBooks(res.data);
//       } catch (err) {
//         console.error("Error fetching books:", err.message);
//         setError("Could not load books.");
//       }
//     };

//     fetchBooks();
//   }, [navigate]);

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Your Dashboard</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
//         {books.map((book) => (
//           <div key={book._id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
//             <h3>{book.title}</h3>
//             <p><strong>Author:</strong> {book.author}</p>
//             {book.image && <img src={book.image} alt={book.title} style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />}
//             <p>{book.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

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
    <div style={{ padding: "2rem" }}>
      <h2>Your Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {books.map((book) => (
          <div key={book._id} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", position: "relative" }}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            {book.image && <img src={book.image} alt={book.title} style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} />}
            <p>{book.description}</p>
            <button
              onClick={() => handleDelete(book._id)}
              style={{ position: "absolute", top: "10px", right: "10px", backgroundColor: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;