import "./chat.css";
import instance from "../../socket/socket";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { joinRoom } from "../../socket/chatFunctions";

import ChatSection from "../../components/chatSection/ChatSection.jsx";
import axios from "axios";

function Chat() {
  const [isDisabled, setIsDisabled] = useState(false);

  const [count, setCount] = useState(0);
  const [friends, setFriends] = useState([]);
  const [friendsMap, setFriendsMap] = useState({});

  const [chatfriend, setChatFriend] = useState(null);
  const [room, setRoom] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [updated, setupdatedAt] = useState("");

  const [me] = useState(localStorage.getItem("id"));

  const [search, setSearch] = useState("");
  const [finduser, setFindUser] = useState("");

  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const flag = useRef(false);

  const handleNotification = () => {
    navigate("/notify");
  };

  const handleFetchMessages = async (roomid, updatedat) => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL +
          "api/messages/getMymessages/" +
          roomid +
          "/" +
          updatedat,
      );

      setMessages(response.data || []);
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  const handlOlderMessages = async (roomid, updatedat) => {
    try {
      flag.current = true;
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL +
          "api/messages/getMymessages/" +
          roomid +
          "/" +
          updatedat,
      );
      //setMessages(response.data);
      setMessages((prev) => [...response.data, ...prev]);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchOlderMessages = async () => {
    if (messages.length === 0) return;

    const oldestMessage = messages[0];

    handlOlderMessages(oldestMessage.roomId, oldestMessage.createdAt);
    console.log(oldestMessage.roomId, oldestMessage.createdAt);
    // const response = await axios.get(
    //  `http://localhost:3000/messages/getMymessages/${room}/${oldestMessage.createdAt}`,
    // );

    //  setMessages((prev) => [...response.data, ...prev]);
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

  const handlechatfriend = async (friend, e) => {
    setChatFriend(friend);
    setMessages([]);
    console.log(e);
    const myid = localStorage.getItem("id");
    const friendid = friend._id;

    const roomId = joinRoom(myid, friendid);

    setRoom(roomId);

    setText("");

    await handleFetchMessages(roomId, e);

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const handleSearch = async () => {
    try {
      if (search.length == 0) return;
      const response = await axios.get(
        import.meta.env.VITE_BASE_URL + "api/request/searchUser",
        {
          params: { email: search },
          withCredentials: true,
        },
      );

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
        import.meta.env.VITE_BASE_URL + "api/request/sendRequest",
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
          `${import.meta.env.VITE_BASE_URL}api/request/getRequestsCount`,
          {
            withCredentials: true,
          },
        );

        setCount(response.data);
        // console.log(response.data);
      } catch (error) {
        // console.log(error?.response);

        toast.error(error?.response?.data || "Error fetching count");
      }
    };

    const getFriends = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/request/getFrends`,
          {
            withCredentials: true,
          },
        );

        // console.log(response.data);
        setFriendsMap(response?.data?.friendsMap);
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
      //   console.log(message);

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
    // console.log(flag);
    if (flag.current == false) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
    flag.current = false;
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
            required
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
              onClick={() =>
                handlechatfriend(friend, friendsMap[friend._id].updatedAt)
              }
            >
              <strong>{friend.name}</strong>

              <p>{friendsMap[friend._id].lastmessage}</p>
            </div>
          ))
        )}
      </div>

      <ChatSection
        chatfriend={chatfriend}
        setupdatedAt={setupdatedAt}
        messages={messages}
        me={me}
        text={text}
        setText={setText}
        handlesendMessage={handlesendMessage}
        bottomRef={bottomRef}
        fetchOlderMessages={fetchOlderMessages}
        setScrollTop
      />

      <Toaster />
    </div>
  );
}

export default Chat;
