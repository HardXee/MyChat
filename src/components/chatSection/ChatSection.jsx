import axios from "axios";
import "./chatSection.css";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

function ChatSection({
  chatfriend,
  messages,
  me,
  text,
  setText,
  handlesendMessage,
  bottomRef,
  fetchOlderMessages,
}) {
  const scrollDemoRef = useRef(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/logOut",
        {},
        {
          withCredentials: true,
        },
      );

      console.log(response.data);

      if (response.data.status === "success") {
        localStorage.removeItem("id");
        localStorage.removeItem("username");

        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScroll = () => {
    if (!scrollDemoRef.current) return;

    const { scrollTop } = scrollDemoRef.current;

    if (scrollTop <= 0) {
      fetchOlderMessages();
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;

    handlesendMessage();
  };

  return (
    <div className="chat-section">
      {/* HEADER */}

      <div className="chat-header">
        <h3>{chatfriend ? chatfriend.name : "Select a friend"}</h3>

        <div>
          <button type="button" disabled>
            Send Location
          </button>

          <button type="button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      {/* MESSAGES */}

      <div className="messages" onScroll={handleScroll} ref={scrollDemoRef}>
        {messages.map((msg, index) => {
          const isMe = msg.sender === me;

          return (
            <div
              key={msg._id || index}
              className={isMe ? "message me" : "message"}
            >
              <span>
                <h4>{msg.text}</h4>

                <h6>
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </h6>
              </span>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* SCROLL BUTTON */}

      <button
        type="button"
        className="scroll-down-btn"
        onClick={() => {
          bottomRef.current?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        ↓
      </button>

      {/* INPUT AREA */}

      <div className="input-area">
        <input
          className="message-input"
          type="text"
          value={text}
          required
          placeholder="Type a message"
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button type="button" className="send-btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatSection;
