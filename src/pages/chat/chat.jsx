import "./chat.css";
import instance from "../../socket/socket";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { joinRoom } from "../../socket/chatFunctions";

import ChatSection from "../../components/chatSection/chatSection";
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
  const bottomRef = useRef(null);

  const handleNotification = () => {
    navigate("/notify");
  };

  const handleFetchMessages = async (roomid) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/messages/getMymessages/${roomid}`,
      );

      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlesendMessage = () => {
    if (!text.trim()) return;

    if (!chatfriend) return;

    const data = {
      roomId: room,
      sender: me,
      receiver: chatfriend._id,
      text: text,
      createdAt: Date.now(),
    };

    instance.emit("send_message", data);

    setText("");
  };

  const handlechatfriend = async (friend) => {
    setChatFriend(friend);

    const myid = localStorage.getItem("id");
    const friendid = friend._id;

    const roomId = joinRoom(myid, friendid);

    setRoom(roomId);

    setText("");

    await handleFetchMessages(roomId);

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
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

  // fetch notification + friends
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

        setFriends(response.data.user.friends);
      } catch (error) {
        console.log(error);
      }
    };

    NotificationCount();
    getFriends();
  }, []);

  // socket connection
  useEffect(() => {
    instance.connect();

    return () => {
      instance.disconnect();
    };
  }, []);

  // receive message listener
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      console.log(message);

      // only append if current room
      if (message.roomId === room) {
        setMessages((prev) => [...prev, message]);
      }
    };

    instance.on("receive_message", handleReceiveMessage);

    return () => {
      instance.off("receive_message", handleReceiveMessage);
    };
  }, [room]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
              onClick={() => handlechatfriend(friend)}
            >
              <strong>{friend.name}</strong>

              <p>Last message...</p>
            </div>
          ))
        )}
      </div>

      <ChatSection
        chatfriend={chatfriend}
        messages={messages}
        me={me}
        text={text}
        setText={setText}
        handlesendMessage={handlesendMessage}
        bottomRef={bottomRef}
      />

      <Toaster />
    </div>
  );
}

export default Chat;
