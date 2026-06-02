import { useState } from "react";
import "./notify.css";
import { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Notify() {
  const [requests, setRequests] = useState([]);
  const Navigate = useNavigate();

  const handleAcceptRequest = async (e) => {
    try {
      const responce = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/request/acceptRequest/${e}`,
        {}, // empty body
        {
          withCredentials: true,
        },
      );

      // console.log(responce.data);
      if (responce.data.status == "success") {
        toast.success(responce.data.message);
        Navigate("/chat");
      }
    } catch (error) {
      //  console.log(error);
    }
  };

  useEffect(() => {
    const getmyRequest = async () => {
      try {
        const responce = await axios.get(
          "http://localhost:3000/api/request/getreceivedRequests",
          {
            withCredentials: true,
          },
        );
        console.log(responce.data);
        setRequests(responce.data);
      } catch (error) {
        console.log(error);
      }
    };

    getmyRequest();
  }, []);

  return (
    <div className="notification-page">
      <h2>Friend Requests</h2>

      {requests.map((user) => (
        <div className="request-card" key={user}>
          <span>{user.sender.email}</span>

          <div className="request-buttons">
            <button
              className="accept-btn"
              onClick={() => {
                handleAcceptRequest(user.sender._id);
              }}
            >
              Accept
            </button>
            <button className="reject-btn">Reject</button>
          </div>
        </div>
      ))}
      <Toaster />
    </div>
  );
}

export default Notify;
