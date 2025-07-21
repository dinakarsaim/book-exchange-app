import { useEffect, useState } from "react";
import API from "../services/api";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await API.get("/requests/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err.message);
        setError("Failed to load your requests.");
      }
    };

    fetchMyRequests();
  }, []);

  return (
    <div className="container">
      <h1>My Borrow Requests</h1>
      {error && <p className="error">{error}</p>}

      {requests.length === 0 ? (
        <p>You haven’t requested any books yet.</p>
      ) : (
        <ul className="request-list">
          {requests.map((r) => (
            <li key={r._id} className="card request-card">
              <p><strong>Book:</strong> {r.book?.title || "Book deleted"}</p>
              <p>
                <strong>Owner:</strong>{" "}
                {r.book?.owner?.name
                  ? `${r.book.owner.name} (${r.book.owner.email})`
                  : "Unknown"}
              </p>
              <p><strong>Status:</strong> {r.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyRequests;