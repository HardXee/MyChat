import "./chatSection.css";

function ChatSection({
  chatfriend,
  messages,
  me,
  text,
  setText,
  handlesendMessage,
  bottomRef,
}) {
  return (
    <div className="chat-section">
      <div className="chat-header">
        <h3>{chatfriend ? chatfriend.name : "Select a friend"}</h3>

        <button>send location</button>
      </div>

      <div className="messages">
        {messages.map((msg) => {
          const isMe = msg.sender == me;

          return (
            <div
              key={msg._id || Math.random()}
              className={isMe ? "message me" : "message"}
            >
              <span>
                <h4>{msg.text}</h4>

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

        <div ref={bottomRef}></div>
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
