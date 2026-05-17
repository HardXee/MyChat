import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Login() {
  const [email, SetEmail] = useState("");
  const [password, Setpassword] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const responce = await axios.post(
        import.meta.env.VITE_LOGIN_URL,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      );

      const coki = `${document.cookie}`;
      console.log(coki);
      localStorage.setItem("username", responce.data.name);
      localStorage.setItem("id", responce.data.id);
      toast.success(responce.data.message);
      Navigate("/chat");
    } catch (error) {
      console.log(`error is ${error}`);
      toast.error("wrong credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="form">
        <input
          type="text"
          value={email}
          placeholder="username"
          onChange={(e) => {
            SetEmail(e.target.value);
          }}
        />
        <input
          type="password"
          vlaue={password}
          placeholder="password"
          onChange={(e) => {
            Setpassword(e.target.value);
          }}
        />
        <button
          onClick={() => {
            handleSubmit();
            console.log(" puni puni working ");
          }}
        >
          login
        </button>
        <p className="message">
          Not registered? <Link to="/register">Create an account</Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
}

export default Login;
