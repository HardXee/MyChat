import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Chat from "./pages/chat/chat";
import Notify from "./pages/notification/notify";

import ForgotPassword from "./pages/forgotPassword/forgotpassword";
import ResetPassword from "./pages/resetPassword/resetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notify" element={<Notify />} />

        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset_password/:id/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
