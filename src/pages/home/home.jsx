import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const gotoLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1> home page</h1>

      <button
        onClick={() => {
          gotoLogin();
        }}
      >
        Login Page
      </button>
    </div>
  );
}

export default Home;
