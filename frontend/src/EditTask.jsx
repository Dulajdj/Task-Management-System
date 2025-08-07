// frontend/src/EditTask.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTitle(res.data.title);
        setDescription(res.data.description || "");
        setDueDate(new Date(res.data.dueDate).toISOString().split("T")[0]);
        setPriority(res.data.priority);
        setStatus(res.data.status);
      } catch (err) {
        setMessage(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.put(
        `/api/tasks/${id}`,
        { title, description, dueDate, priority, status },
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
        background: "linear-gradient(135deg, #4a90e2, #ff6b6b)",
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
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
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
            color: "#2c3e50",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          Edit Task
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            border: "2px solid #ecf0f1",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            backgroundColor: "#f9f9f9",
            transition: "border-color 0.3s, box-shadow 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#4a90e2",
              boxShadow: "0 0 5px rgba(74, 144, 226, 0.5)",
            },
          }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            border: "2px solid #ecf0f1",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            minHeight: "100px",
            resize: "vertical",
            backgroundColor: "#f9f9f9",
            transition: "border-color 0.3s, box-shadow 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#4a90e2",
              boxShadow: "0 0 5px rgba(74, 144, 226, 0.5)",
            },
          }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          style={{
            border: "2px solid #ecf0f1",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            backgroundColor: "#f9f9f9",
            transition: "border-color 0.3s, box-shadow 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#4a90e2",
              boxShadow: "0 0 5px rgba(74, 144, 226, 0.5)",
            },
          }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            border: "2px solid #ecf0f1",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            backgroundColor: "#f9f9f9",
            transition: "border-color 0.3s, box-shadow 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#4a90e2",
              boxShadow: "0 0 5px rgba(74, 144, 226, 0.5)",
            },
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            border: "2px solid #ecf0f1",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px",
            width: "100%",
            fontSize: "16px",
            backgroundColor: "#f9f9f9",
            transition: "border-color 0.3s, box-shadow 0.3s",
            outline: "none",
            ":focus": {
              borderColor: "#4a90e2",
              boxShadow: "0 0 5px rgba(74, 144, 226, 0.5)",
            },
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(90deg, #4a90e2, #ff6b6b)",
            color: "white",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
            transition: "transform 0.3s, background 0.3s",
            ":hover": {
              transform: "scale(1.05)",
              background: "linear-gradient(90deg, #357abd, #e63946)",
            },
          }}
        >
          Update Task
        </button>
        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: message.includes("wrong") ? "#e74c3c" : "#2ecc71",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default EditTask;