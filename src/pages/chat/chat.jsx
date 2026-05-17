import "./chat.css";
import instance from "../../socket/socket";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { joinRoom } from "../../socket/chatFunctions";

import axios from "axios";

function Chat() {
  const [isDisabled, setIsDisabled] = useState(false);

  const [count, setCount] = useState(0);
  const [friends, setFriends] = useState([]);

  const [chatfriend, setChatFriend] = useState(null);
  const [room, setRoom] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const [me] = useState(localStorage.getItem("id"));

  const [search, setSearch] = useState("");

  const [finduser, setFindUser] = useState("");

  const navigate = useNavigate();

  const handleNotification = () => {
    navigate("/notify");
  };

  const handleFetchMessages = async (roomid) => {
    try {
      const responce = await axios.get(
        `http://localhost:3000/messages/getMymessages/${roomid}`,
      );

      console.log(responce);

      setMessages(responce.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlesendMessage = () => {
    console.log("handlesendessAGE");
    const data = {
      roomId: room,
      sender: me,
      receiver: chatfriend,
      text: text,
      createdAt: Date.now(),
    };
    instance.emit("send_message", data);
    setMessages((prev) => [...prev, data]);
  };

  const handlechatfriend = (e) => {
    setChatFriend(e);
    let myid = localStorage.getItem("id");
    let friendid = e._id;
    console.log(myid, friendid);
    setText("");
    let roomId = joinRoom(myid, friendid);
    setRoom(roomId);
    console.log(roomId);
    handleFetchMessages(roomId);
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
    const NotificationCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/request/getRequestsCount`,
          {
            withCredentials: true,
          },
        );

        setCount(response.data);
      } catch (error) {
        console.log(error?.response);

        toast.error(error?.response?.data || "Error fetching count");
      }
    };

    const getFriends = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/request/getFrends`,
          {
            withCredentials: true,
          },
        );

        console.log(response.data.user.friends);

        setFriends(response.data.user.friends);
      } catch (error) {
        console.log(error);
      }
    };

    NotificationCount();

    getFriends();

    instance.connect();

    const handleReceiveMessage = (message) => {
      console.log(message);

      // setMessages((prev) => [...prev, message]);
    };

    instance.on("receive_message", handleReceiveMessage);

    return () => {
      instance.off("receive_message", handleReceiveMessage);
    };
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
            <div
              key={friend._id}
              className={
                chatfriend?._id === friend._id
                  ? "contact-item active"
                  : "contact-item"
              }
              onClick={() => {
                handlechatfriend(friend);
              }}
            >
              <strong>{friend.name}</strong>

              <p>Last message...</p>
            </div>
          ))
        )}
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <h3>{chatfriend ? chatfriend.name : "Select a friend"}</h3>
        </div>

        <div className="messages">
          {messages.map((msg) => {
            const isMe = msg.sender == me;

            return (
              <div key={msg._id} className={isMe ? "message me" : "message"}>
                <span>
                  <h4> {msg.text} </h4>
                  <h6>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h6>
                </span>
              </div>
            );
          })}
        </div>

        <div className="input-area">
          <input
            className="message-input"
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
            required
            placeholder="Type a message"
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

      <Toaster />
    </div>
  );
}

export default Chat;
