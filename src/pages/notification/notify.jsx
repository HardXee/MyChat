import { useState } from "react";
import "./notify.css";
import { useEffect } from "react";
import axios from "axios";

function Notify() {
  const requests = [
    { id: 1, name: "Rahul" },
    { id: 2, name: "Priya" },
    { id: 3, name: "Aman" },
  ];

  useEffect(() => {});

  return (
    <div className="notification-page">
      <h2>Friend Requests</h2>

      {requests.map((user) => (
        <div className="request-card" key={user.id}>
          <span>{user.name}</span>

          <div className="request-buttons">
            <button className="accept-btn">Accept</button>
            <button className="reject-btn">Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notify;
