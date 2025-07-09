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
    <div style={{ padding: "2rem" }}>
      <h2>My Borrow Requests</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {requests.length === 0 ? (
        <p>You haven’t requested any books yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {requests.map((r) => (
            <li
              key={r._id}
              style={{
                marginBottom: "1rem",
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
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