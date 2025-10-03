// import { useEffect, useState } from "react";
// import API from "../services/api";
// import Navbar from "../components/Navbar";


// function IncomingRequests() {
//   const [requests, setRequests] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchIncomingRequests = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await API.get("/requests/incoming", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRequests(res.data);
//       } catch (err) {
//         console.error("Error fetching requests:", err.message);
//         setError("Failed to load incoming requests.");
//       }
//     };

//     fetchIncomingRequests();
//   }, []);

//   const updateStatus = async (id, status) => {
//     try {
//       const token = localStorage.getItem("token");
//       await API.patch(`/requests/${id}`, { status }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setRequests((prev) =>
//         prev.map((r) => (r._id === id ? { ...r, status } : r))
//       );
//     } catch (err) {
//       console.error("Error updating status:", err.message);
//       alert("Failed to update status");
//     }
//   };

//   return (
//     <div className="over-container">
//       <Navbar/>
//     <div className="container">
//       <h1 className="page-header">Incoming Borrow Requests</h1>
//       {error && <p className="error">{error}</p>}

//       {requests.length === 0 ? (
//         <p>No incoming requests.</p>
//       ) : (
//         <ul className="request-list">
//           {requests.map((r) => (
//             <li key={r._id} className="card request-card">
//               <p><strong>Book:</strong> {r.book.title}</p>
//               <p><strong>Requested by:</strong> {r.requester.name} ({r.requester.email})</p>
//               <p><strong>Status:</strong> {r.status}</p>

//               {r.status === "pending" && (
//                 <div className="action-buttons">
//                   <button className="accept-btn" onClick={() => updateStatus(r._id, "accepted")}>
//                     Accept
//                   </button>
//                   <button className="reject-btn" onClick={() => updateStatus(r._id, "rejected")}>
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//     </div>
//   );
// }

// export default IncomingRequests;

import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import OtherNavbar from "../components/OtherNavbar";

function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [editingPickupFor, setEditingPickupFor] = useState(null); // request id being edited
  const [pickupText, setPickupText] = useState("");

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

  const updateStatus = async (id, status, pickupInfo = null) => {
    try {
      const token = localStorage.getItem("token");
      const body = { status };
      if (pickupInfo) body.pickupInfo = pickupInfo;

      const res = await API.patch(`/requests/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // update the single request entry in state from the response if provided
      const updated = res.data.request || null;
      setRequests(prev =>
        prev.map(r => (r._id === id ? (updated || { ...r, status, pickupInfo }) : r))
      );

      // clear pickup editor UI
      setEditingPickupFor(null);
      setPickupText("");
    } catch (err) {
      console.error("Error updating status:", err.message);
      alert("Failed to update status");
    }
  };

  return (
    <div className="over-container">
      <OtherNavbar/>
      <div className="container">
        <h1 className="page-header">Incoming Borrow Requests</h1>
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

                {/* show pickup info if exists */}
                {r.pickupInfo && (
                  <p><strong>Pickup info:</strong> {r.pickupInfo}</p>
                )}

                {r.status === "pending" && (
                  <div className="action-buttons">
                    {/* Accept button opens a small input for pickup info */}
                    {editingPickupFor === r._id ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="Address or meetup details (optional)"
                          value={pickupText}
                          onChange={(e) => setPickupText(e.target.value)}
                          style={{ padding: "6px 8px", minWidth: 240 }}
                        />
                        <button
                          className="accept-btn"
                          onClick={() => updateStatus(r._id, "accepted", pickupText)}
                        >
                          Confirm Accept
                        </button>
                        <button onClick={() => { setEditingPickupFor(null); setPickupText(""); }}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className="accept-btn"
                          onClick={() => { setEditingPickupFor(r._id); setPickupText(r.pickupInfo || ""); }}
                        >
                          Accept
                        </button>
                        <button className="reject-btn" onClick={() => updateStatus(r._id, "rejected")}>
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default IncomingRequests;