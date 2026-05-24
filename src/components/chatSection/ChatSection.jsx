import axios from "axios";
import "./chatSection.css";
import React, { useState, useRef } from "react";
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
  const Navigate = useNavigate();

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
      if (response.data.status == "success") {
        localStorage.removeItem("id");
        localStorage.removeItem("username");

        Navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleScroll = () => {
    if (scrollDemoRef.current) {
      const { scrollTop } = scrollDemoRef.current;
      // console.log(scrollTop);
      if (scrollTop == 0) {
        fetchOlderMessages();
      }
    }
  };

  return (
    <div className="chat-section">
      <div className="chat-header">
        <h3>{chatfriend ? chatfriend.name : "Select a friend"}</h3>

        <button disabled>send location</button>

        <button onClick={handleLogout}>Log Out</button>
      </div>

      <div className="messages" onScroll={handleScroll} ref={scrollDemoRef}>
        {messages.map((msg, index) => {
          const isMe = msg.sender == me;

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

      <button
        className="scroll-down-btn"
        onClick={() => {
          bottomRef.current?.scrollIntoView({
            behavior: "smooth",
          });
        }}
      >
        ↓
      </button>

      <div className="input-area">
        <input
          className="message-input"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
          required
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handlesendMessage();
            }
          }}
        />

        <button
          className="send-btn"
          onClick={() => {
            handlesendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatSection;
