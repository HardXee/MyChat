import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const [email, SetEmail] = useState("");
  const [password, Setpassword] = useState("");

  const handleSubmit = async () => {
    try {
      const responce = await axios.post(import.meta.env.VITE_REGISTER_URL, {
        email: email,
        password: password,
      });
      toast.success(responce.data.message);
      console.log(responce);
    } catch (error) {
      console.log(error.response?.data);

      const msg = error.response?.data?.message;
      toast.error(msg);
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
          }}
        >
          Sign up
        </button>
        <p className="message">
          Aready have account ? <Link to="/Login">Login</Link>
        </p>
      </div>
      <Toaster />
    </div>
  );
}

export default Register;
