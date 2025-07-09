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
    <div style={{ padding: "2rem" }}>
      <h2>Incoming Borrow Requests</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {requests.length === 0 ? (
        <p>No incoming requests.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {requests.map((r) => (
            <li key={r._id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <p><strong>Book:</strong> {r.book.title}</p>
              <p><strong>Requested by:</strong> {r.requester.name} ({r.requester.email})</p>
              <p><strong>Status:</strong> {r.status}</p>

              {r.status === "pending" && (
                <div style={{ marginTop: "0.5rem" }}>
                  <button onClick={() => updateStatus(r._id, "accepted")} style={{ marginRight: "1rem" }}>✅ Accept</button>
                  <button onClick={() => updateStatus(r._id, "rejected")}>❌ Reject</button>
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