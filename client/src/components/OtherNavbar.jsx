// // import { useNavigate } from "react-router-dom";

// // function Navbar() {
// //   const navigate = useNavigate();

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     navigate("/login");
// //   };

// //   return (
// //     <nav className="navbar">
// //       <h3 className="navbar-logo">BOOKBARTER</h3>
// //       <div className="nav-links">
// //         <button onClick={() => navigate("/")}>Home</button>
// //         <button onClick={() => navigate("/dashboard")}>Dashboard</button>
// //         <button onClick={() => navigate("/add")}>Add Book</button>
// //         <button onClick={() => navigate("/my-requests")}>My Requests</button>
// //         <button onClick={() => navigate("/incoming-requests")}>Incoming</button>
// //         <button onClick={handleLogout} className="logout-btn">Logout</button>
// //       </div>
// //     </nav>
// //   );
// // }

// // export default Navbar;

// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import "./Navbar.css";

// function Navbar() {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       {/* <h3 className="navbar-logo">BOOKBARTER</h3> */}
//       <div className="nav-links">
//         <button onClick={() => navigate("/")}>Home</button>
//         <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//         <button onClick={() => navigate("/add")}>Add Book</button>

//         {/* Dropdown for Requests */}
//         <div
//           className="dropdown"
//           onMouseEnter={() => setDropdownOpen(true)}
//           onMouseLeave={() => setDropdownOpen(false)}
//         >
//           <button>Requests ▾</button>
//           {dropdownOpen && (
//             <div className="dropdown-menu">
//               <button onClick={() => navigate("/my-requests")}>
//                 Sent Requests
//               </button>
//               <button onClick={() => navigate("/incoming-requests")}>
//                 Incoming Requests
//               </button>
//             </div>
//           )}
//         </div>

//         <button onClick={handleLogout} className="logout-btn">
//           Logout
//         </button>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

// src/components/Navbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function OtherNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  // prefill search box from URL (so it shows current q)
  const [q, setQ] = useState(new URLSearchParams(location.search).get("q") || "");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const submitSearch = (e) => {
    e && e.preventDefault();
    const trimmed = (q || "").trim();
    const params = new URLSearchParams();

    // keep genre if it exists in current url (optional)
    const current = new URLSearchParams(location.search);
    const currentGenre = current.get("genre");
    if (currentGenre) params.set("genre", currentGenre);

    if (trimmed) params.set("q", trimmed);

    // navigate to home with query string (push to history)
    navigate(`/?${params.toString()}`);
  };

  return (
    <nav className="navbar" style={{backgroundColor : "#1f1f2b", height: "30px"}}>

        <div className="brand" style={{margin: "0"}}>
            <h3 className="navbar-logo">
                <span className="logo-book">BOOK</span>
                <span className="logo-hive">HIVE</span>

            </h3>
        </div>

      <div className="nav-links">
        <form className="nav-search" onSubmit={submitSearch} role="search">
          <input
            type="search"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search"
          />
          {/* <button type="submit" aria-label="Submit search">🔍</button> */}
        </form>

        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/add")}>Add Book</button>

        <div
          className="dropdown"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button type="button">Requests ▾</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/my-requests")}>Sent Requests</button>
              <button onClick={() => navigate("/incoming-requests")}>Incoming Requests</button>
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default OtherNavbar;