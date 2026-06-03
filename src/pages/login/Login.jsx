import "./Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [email, SetEmail] = useState("");
  const [password, Setpassword] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = async (emailArg = email, passwordArg = password) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_URL + "api/auth/login",
        {
          email: emailArg,
          password: passwordArg,
        },
        {
          withCredentials: true,
        },
      );

      localStorage.setItem("username", response.data?.name);
      localStorage.setItem("id", response.data?.id);

      setTimeout(() => {
        Navigate("/chat");
        toast.success(response.data?.message);
      }, 250);
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <fieldset>
          <legend>Welcome again!</legend>

          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              SetEmail(e.target.value);
            }}
          />

          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => {
              Setpassword(e.target.value);
            }}
          />

          <button onClick={() => handleSubmit()}>Login</button>

          {/* Guest Login Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => handleSubmit("Guest1@gmail.com", "123456")}
            >
              Guest 1
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("Guest2@gmail.com", "123456")}
            >
              Guest 2
            </button>
          </div>

          <p className="message">
            Forgot password? <Link to="/forgot_password">Forgot Password</Link>
          </p>

          <p className="message">
            Not registered? <Link to="/register">Create an account</Link>
          </p>
        </fieldset>

        <Toaster />
      </div>
    </div>
  );
}

export default Login;
