// // import React, { useEffect, useState } from "react";
// // import API from "../services/api";
// // import { jwtDecode } from "jwt-decode";

// // const Home = () => {
// //   const [books, setBooks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const token = localStorage.getItem("token");
// //   let userId = null;

// //   if (token) {
// //     const decoded = jwtDecode(token);
// //     userId = decoded.userId;
// //   }

// //   useEffect(() => {
// //     const fetchBooks = async () => {
// //       try {
// //         const res = await API.get("/books");
// //         console.log(res.data);
// //         setBooks(res.data);
// //       } catch (err) {
// //         console.error(err);
// //         setError("Failed to load books");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchBooks();
// //   }, []);

// //   const handleRequest = async (bookId) => {
// //     try {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         alert("Please login first.");
// //         return;
// //       }

// //       await API.post("/requests", { bookId });
// //       alert("Request sent!");
// //     } catch (err) {
// //       console.error("Request failed:", err.response?.data?.message || err.message);
// //       alert(err.response?.data?.message || "Error sending request");
// //     }
// //   };

// //   return (
// //     <div className="container">
// //       <h1 className = "page-header">Available Books</h1>
// //       {loading && <p>Loading...</p>}
// //       {error && <p style={{ color: "red" }}>{error}</p>}
// //       <div className="grid">
// //         {books.map((book) => (
// //           <div className="card" key={book._id}>
// //             {book.image && (
// //               <img src={book.image} alt={book.title} />
// //             )}
// //             <h2>{book.title}</h2>
// //             <p><strong>Author:</strong> {book.author}</p>
// //             <p><strong>Posted by:</strong> {book.owner?.name || "Unknown"}</p>
// //             {userId && userId !== book.owner._id && (
// //               // <button onClick={() => handleRequest(book._id)}>Request Book</button>
// //               <button
// //                 className="plus-btn"
// //                 onClick={() => handleRequest(book._id)}
// //                 aria-label="Request Book"
// //               >
// //                 +
// //               </button>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default Home;


// // src/pages/Home.jsx
// import React, { useEffect, useState } from "react";
// import API from "../services/api"; // your axios instance
// import { jwtDecode } from "jwt-decode";
// import Sidebar from "../components/sideBar";
// import Navbar from "../components/Navbar";
// import { useLocation } from "react-router-dom";

// const Home = () => {
//   const [books, setBooks] = useState([]);
//   const [selectedGenre, setSelectedGenre] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const qParam = query.get("q") || null; 

//   const token = localStorage.getItem("token");
//   let userId = null;
//   if (token) {
//     try {
//       const decoded = jwtDecode(token);
//       userId = decoded.userId;
//     } catch (e) {
//       userId = null;
//     }
//   }

//   const fetchBooks = async (genre = null) => {
//     setLoading(true);
//     setError("");
//     try {
//       const url = genre ? `/books?genre=${encodeURIComponent(genre)}` : "/books";
//       const res = await API.get(url);
//       setBooks(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load books");
//       setBooks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks(null); // initial: all books
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // when selectedGenre changes, fetch by genre (null => all)
//   useEffect(() => {
//     fetchBooks(selectedGenre);
//   }, [selectedGenre]);

//   const handleRequest = async (bookId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) { alert("Please login first."); return; }
//       await API.post("/requests", { bookId }, { headers: { Authorization: `Bearer ${token}` }});
//       alert("Request sent!");
//     } catch (err) {
//       console.error("Request failed:", err.response?.data?.message || err.message);
//       alert(err.response?.data?.message || "Error sending request");
//     }
//   };

//   return (
//     <div className="app-layout">
//       <Sidebar selectedGenre={selectedGenre} onSelectGenre={setSelectedGenre} />

//       <main className="main-content" style={{ flex: 1 }}>
//         <Navbar></Navbar>
//         <h1 className="page-header">Available Books {selectedGenre ? `— ${selectedGenre}` : ""}</h1>

//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: "red" }}>{error}</p>}

//         <div className="grid">
//           {books.map((book) => (
//             <div className="card" key={book._id}>
//               {book.image ? <img src={book.image} alt={book.title} /> : <div className="cover placeholder" />}
//               <h2>{book.title}</h2>
//               <p><strong>Author:</strong> {book.author}</p>
//               <p><strong>Posted by:</strong> {book.owner?.name || "Unknown"}</p>

//               {userId && userId !== book.owner?._id && (
//                 <button className="plus-btn" onClick={() => handleRequest(book._id)} aria-label="request">+</button>
//               )}
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Home;

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

  const fetchBooks = async ({ genre = null, q = null } = {}) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (genre) params.set("genre", genre);
      if (q) params.set("q", q);
      const url = params.toString() ? `/books?${params.toString()}` : "/books";
      const res = await API.get(url);
      setBooks(res.data || []);
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

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="grid">
            {books.map((book) => (
              <div className="card" key={book._id}>
                {book.image ? <img src={book.image} alt={book.title} /> : <div className="cover placeholder" />}
                <h2>{book.title}</h2>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Posted by:</strong> {book.owner?.name || "Unknown"}</p>

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