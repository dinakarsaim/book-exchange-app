// import { useNavigate } from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <h3 className="navbar-logo">BOOKBARTER</h3>
//       <div className="nav-links">
//         <button onClick={() => navigate("/")}>Home</button>
//         <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//         <button onClick={() => navigate("/add")}>Add Book</button>
//         <button onClick={() => navigate("/my-requests")}>My Requests</button>
//         <button onClick={() => navigate("/incoming-requests")}>Incoming</button>
//         <button onClick={handleLogout} className="logout-btn">Logout</button>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h3 className="navbar-logo">BOOKBARTER</h3>
      <div className="nav-links">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/add")}>Add Book</button>

        {/* Dropdown for Requests */}
        <div
          className="dropdown"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button>Requests ▾</button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/my-requests")}>
                Sent Requests
              </button>
              <button onClick={() => navigate("/incoming-requests")}>
                Incoming Requests
              </button>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;