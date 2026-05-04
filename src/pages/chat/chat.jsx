import "./chat.css";
import instance from "../../socket/socket";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

function Chat() {
  const contacts = ["Rahul", "Priya", "Amit", "Sneha", "Karan", "Neha"];
  const [me, setMe] = useState(localStorage.getItem("username"));
  const [search, setSearch] = useState("");
  const [finduser, setFindUser] = useState("");
  const Navigate = useNavigate();

  const messages = [
    // here fatch the data usign api
    { id: 1, text: "Hello", time: "10:20 AM", me: false },
    { id: 2, text: "Hi, how are you?", time: "10:21 AM", me: true },
    { id: 3, text: "I'm good", time: "10:22 AM", me: false },
  ];

  function handleNotification() {
    Navigate("/notify");
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_SEARCH_USER, {
        params: { email: search },
        withCredentials: true,
      });

      console.log(response.data);
      setFindUser(response.data.email);
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data);
    }
  };

  const SendRequest = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SEND_REQUEST,
        {
          email: search,
        },
        {
          withCredentials: true,
        },
      );

      console.log(response.data);
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data);
    }
  };

  useEffect(() => {
    instance.connect();
    console.log(me);
  }, []);

  return (
    <div className="chat-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar_addbutton">Desi chats</div>

          <div className="header-actions">
            <button className="notification-btn" onClick={handleNotification}>
              🔔
            </button>
          </div>

          <input
            className="search-box"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search..."
          />
          <button onClick={handleSearch}>🔍</button>
        </div>

        {finduser.length !== 0 ? (
          <div className="found-user-card">
            <div className="found-user-email">{finduser}</div>

            <button className="send-request-btn" onClick={SendRequest}>
              Send Request
            </button>
          </div>
        ) : (
          contacts.map((name, index) => (
            <div key={index} className="contact-item">
              <strong>{name}</strong>
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
