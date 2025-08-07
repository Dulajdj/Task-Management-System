import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("/api/users/register", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message);
      setEmail("");
      setPassword("");
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: res.data.message,
      });
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      setMessage(errorMsg);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMsg,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "28px 24px",
          borderRadius: "10px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          width: "100%",
          maxWidth: "340px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "600",
            color: "#333",
            marginBottom: "18px",
            letterSpacing: "0.5px",
          }}
        >
          Register
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            border: "1px solid #d1d5db",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "6px",
            width: "100%",
            fontSize: "15px",
            background: "#f9fafb",
            outline: "none",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            border: "1px solid #d1d5db",
            padding: "10px",
            marginBottom: "16px",
            borderRadius: "6px",
            width: "100%",
            fontSize: "15px",
            background: "#f9fafb",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            marginBottom: "10px",
            transition: "background 0.2s",
          }}
          onMouseOver={e => e.currentTarget.style.background = "#1d4ed8"}
          onMouseOut={e => e.currentTarget.style.background = "#2563eb"}
        >
          Register
        </button>
        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "8px",
              color: message.includes("already") || message.includes("wrong") ? "#e11d48" : "#059669",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}
        <p
          style={{
            textAlign: "center",
            marginTop: "14px",
            color: "#555",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "bold",
            }}
            onMouseOver={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseOut={e => e.currentTarget.style.textDecoration = "none"}
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default App;