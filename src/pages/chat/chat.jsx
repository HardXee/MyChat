import "./chat.css";
import instance from "../../socket/socket";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function Chat() {
  const [isDisabled, setIsDisabled] = useState(false);
  const [count, setCount] = useState(0);

  const [friends, setFriends] = useState([]);

  const [me, setMe] = useState(localStorage.getItem("username"));
  const [search, setSearch] = useState("");
  const [finduser, setFindUser] = useState("");
  const navigate = useNavigate();

  const messages = [
    { id: 1, text: "Hello", time: "10:20 AM", me: false },
    { id: 2, text: "Hi, how are you?", time: "10:21 AM", me: true },
    { id: 3, text: "I'm good", time: "10:22 AM", me: false },
  ];

  const handleNotification = () => {
    navigate("/notify");
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_SEARCH_USER, {
        params: { email: search },
        withCredentials: true,
      });

      setFindUser(response.data.email || "");
    } catch (error) {
      console.log(error?.response);
      toast.error(error?.response?.data || "User not found");
      setFindUser("");
    }
  };

  const SendRequest = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SEND_REQUEST,
        { email: search },
        { withCredentials: true },
      );

      toast.success(response?.data);
      setIsDisabled(true);
    } catch (error) {
      console.log(error?.response);
      toast.error(error?.response?.data || "Request failed");
    }
  };

  useEffect(() => {
    // ✅ FIXED
    const NotificationCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/request/getRequestsCount`,

          { withCredentials: true },
        );
        console.log("working");
        console.log(response.data);

        // assuming backend returns { count: number }
        setCount(response.data);
      } catch (error) {
        console.log(error?.response);
        toast.error(error?.response?.data || "Error fetching count");
      }
    };

    const getFrends = async () => {
      try {
        const responce = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/request/getFrends`,
          {
            withCredentials: true,
          },
        );

        console.log(responce.data.user.friends);
        setFriends(responce.data.user.friends);

        if (responce.status == "success") {
          setFriends(responce.data.data.friends);
        }
      } catch (error) {
        console.log(error);
      }
    };

    NotificationCount();
    getFrends();
    console.log("COMPONENT MOUNTED"); // 👈 check this
    instance.connect();
  }, []);

  return (
    <div className="chat-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar_addbutton">Desi chats</div>

          <div className="header-actions">
            <button className="notification-btn" onClick={handleNotification}>
              🔔 {count > 0 && <span className="badge">{count}</span>}
            </button>
          </div>

          <input
            className="search-box"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>🔍</button>
        </div>

        {finduser ? (
          <div className="found-user-card">
            <div className="found-user-email">{finduser}</div>

            <button
              className="send-request-btn"
              disabled={isDisabled}
              onClick={SendRequest}
            >
              {isDisabled ? "Sent" : "Send Request"}
            </button>
          </div>
        ) : (
          friends.map((friend) => (
            <div key={friend._id} className="contact-item">
              <strong>{friend.name}</strong>
              <p>Last message...</p>
            </div>
          ))
        )}
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <h3>{me}</h3>
        </div>

        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={msg.me ? "message me" : "message"}>
              <span>
                {msg.text} <small>{msg.time}</small>
              </span>
            </div>
          ))}
        </div>

        <div className="input-area">
          <input className="message-input" placeholder="Type a message" />
          <button className="send-btn">Send</button>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default Chat;
