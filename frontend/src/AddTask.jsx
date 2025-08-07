// frontend/src/AddTask.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description, dueDate, priority },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6b48ff, #00d4ff)",
        padding: "20px",
        "@media (max-width: 640px)": {
          padding: "10px",
        },
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
          "@media (max-width: 640px)": {
            padding: "20px",
          },
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Add Task
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            border: "2px solid #ddd",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            transition: "border-color 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#6b48ff",
            },
          }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            border: "2px solid #ddd",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            minHeight: "100px",
            resize: "vertical",
            transition: "border-color 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#6b48ff",
            },
          }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          style={{
            border: "2px solid #ddd",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            transition: "border-color 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#6b48ff",
            },
          }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            border: "2px solid #ddd",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            backgroundColor: "white",
            transition: "border-color 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#6b48ff",
            },
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(90deg, #6b48ff, #00d4ff)",
            color: "white",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
            transition: "transform 0.3s, background 0.3s",
            ":hover": {
              transform: "scale(1.05)",
              background: "linear-gradient(90deg, #5a3de6, #00b3d9)",
            },
          }}
        >
          Add Task
        </button>
        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: message.includes("wrong") ? "#e53e3e" : "#48bb78",
              fontSize: "14px",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default AddTask;