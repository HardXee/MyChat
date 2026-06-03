import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>
            Every Conversation.
            <br />
            Only Between You Two. 🔒💕
          </h1>

          <p>
            A secure chat app designed for couples.
            <br />
            No ads. No distractions. Just meaningful conversations.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Start Chatting
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>

          <div className="features">
            <div className="feature">🔒 100% Private Conversations</div>

            <div className="feature">💕 Built For Couples</div>

            <div className="feature">⚡ Fast & Real-Time Messaging</div>
          </div>
        </div>

        <div className="hero-image">
          <div className="phone-card">
            <div className="chat-bubble left">Missing you ❤️</div>

            <div className="chat-bubble right">Me too 🥺</div>

            <div className="chat-bubble left">Call tonight?</div>

            <div className="chat-bubble right">Always 💕</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
