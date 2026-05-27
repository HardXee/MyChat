// ResetPassword.jsx

import "./resetPassword.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const { id, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    console.log(id);
    console.log(token);

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/resetpassword`,
        {
          id,
          token,
          password,
        },
      );

      // alert(response.data.message);
      if (response.data?.status == "success") {
        toast.success(response.data.message);
        Navigate("/login");
      }
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <div className="reset-header">
          <h1>Reset Password</h1>

          <p>Enter your new password below.</p>
        </div>

        <form className="reset-form" onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="New Password"
            className="reset-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="reset-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}

export default ResetPassword;
