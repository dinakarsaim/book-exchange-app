// import { useEffect, useState } from "react";
// import API from "../services/api";
// import Navbar from "../components/Navbar";

// function MyRequests() {
//   const [requests, setRequests] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchMyRequests = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await API.get("/requests/my", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setRequests(res.data);
//       } catch (err) {
//         console.error("Error fetching requests:", err.message);
//         setError("Failed to load your requests.");
//       }
//     };

//     fetchMyRequests();
//   }, []);

//   return (
//     <div className="over-container">
//       <Navbar/>
//     <div className="container">
//       <h1 className="page-header">My Borrow Requests</h1>
//       {error && <p className="error">{error}</p>}

//       {requests.length === 0 ? (
//         <p>You haven’t requested any books yet.</p>
//       ) : (
//         <ul className="request-list">
//           {requests.map((r) => (
//             <li key={r._id} className="card request-card">
//               <p><strong>Book:</strong> {r.book?.title || "Book deleted"}</p>
//               <p>
//                 <strong>Owner:</strong>{" "}
//                 {r.book?.owner?.name
//                   ? `${r.book.owner.name} (${r.book.owner.email})`
//                   : "Unknown"}
//               </p>
//               <p><strong>Status:</strong> {r.status}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//     </div>
//   );
// }

// export default MyRequests;

import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import OtherNavbar from "../components/OtherNavbar";

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
    <div className="over-container">
      <OtherNavbar/>
      <div className="container">
        <h1 className="page-header">My Borrow Requests</h1>
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

                {/* show pickup info if accepted */}
                {r.status === "accepted" && (
                  <>
                    <p><strong>Pickup info:</strong> {r.pickupInfo || "Contact owner for details"}</p>
                    {/* you could also show a button to open email or map link if owner provided address */}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyRequests;