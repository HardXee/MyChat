// ForgotPassword.jsx

import "./forgotpassword.css";
import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/forgotpassword`,
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      alert(response.data.message);
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-header">
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a password reset link.</p>
        </div>

        <form className="forgot-form" onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            className="forgot-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
