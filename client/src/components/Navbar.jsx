import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "1rem",
        background: "#f2f2f2",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <h3 style={{ marginRight: "auto" }}>📚 BookBarter</h3>
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      <button onClick={() => navigate("/add-book")}>Add Book</button>
      <button onClick={() => navigate("/my-requests")}>My Requests</button>
      <button onClick={() => navigate("/incoming-requests")}>Incoming</button>
      <button onClick={handleLogout} style={{ color: "red" }}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;