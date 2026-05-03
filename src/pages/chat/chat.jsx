import "./chat.css";
import instance from "../../socket/socket";
import { useEffect } from "react";

function Chat() {
  const contacts = ["Rahul", "Priya", "Amit", "Sneha", "Karan", "Neha"];

  const messages = [
    // here fatch the data usign api
    { id: 1, text: "Hello", time: "10:20 AM", me: false },
    { id: 2, text: "Hi, how are you?", time: "10:21 AM", me: true },
    { id: 3, text: "I'm good", time: "10:22 AM", me: false },
  ];

  useEffect(() => {
    instance.connect();
  }, []);

  return (
    <div className="chat-app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Desi chats</h3>
          <input className="search-box" placeholder="Search..." />
        </div>

        {contacts.map((name, index) => (
          <div key={index} className="contact-item">
            <strong>{name}</strong>
            <p>Last message...</p>
          </div>
        ))}
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <h3>Rahul</h3>
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
    </div>
  );
}

export default Chat;
