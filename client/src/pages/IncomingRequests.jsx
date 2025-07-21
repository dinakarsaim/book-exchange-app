import { useEffect, useState } from "react";
import API from "../services/api";


function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await API.get("/requests/incoming", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err.message);
        setError("Failed to load incoming requests.");
      }
    };

    fetchIncomingRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(`/requests/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Error updating status:", err.message);
      alert("Failed to update status");
    }
  };

  return (
    <div className="container">
      <h1>Incoming Borrow Requests</h1>
      {error && <p className="error">{error}</p>}

      {requests.length === 0 ? (
        <p>No incoming requests.</p>
      ) : (
        <ul className="request-list">
          {requests.map((r) => (
            <li key={r._id} className="card request-card">
              <p><strong>Book:</strong> {r.book.title}</p>
              <p><strong>Requested by:</strong> {r.requester.name} ({r.requester.email})</p>
              <p><strong>Status:</strong> {r.status}</p>

              {r.status === "pending" && (
                <div className="action-buttons">
                  <button className="accept-btn" onClick={() => updateStatus(r._id, "accepted")}>
                    Accept
                  </button>
                  <button className="reject-btn" onClick={() => updateStatus(r._id, "rejected")}>
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IncomingRequests;