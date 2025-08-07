// frontend/src/Dashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [isNightMode, setIsNightMode] = useState(false); // State for night mode
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Fetch Tasks Error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "Pending" ? "Completed" : "Pending";
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Status Toggle Error:", err);
    }
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(task.dueDate).toLocaleDateString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div style={{ textAlign: "center", padding: "24px", color: "#666" }}>Loading...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isNightMode
          ? "linear-gradient(135deg, #1a202c, #2d3748)"
          : "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
        padding: "20px",
        color: isNightMode ? "#e2e8f0" : "#2d3748",
        transition: "background 0.3s, color 0.3s",
        "@media (max-width: 640px)": {
          padding: "10px",
        },
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          "@media (max-width: 640px)": {
            maxWidth: "100%",
          },
        }}
      >
        {/* Night Mode Toggle */}
        <div
          style={{
            marginBottom: "20px",
            textAlign: "right",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              color: isNightMode ? "#e2e8f0" : "#2d3748",
            }}
          >
            <span>Night Mode</span>
            <input
              type="checkbox"
              checked={isNightMode}
              onChange={() => setIsNightMode(!isNightMode)}
              style={{
                width: "0",
                height: "0",
                opacity: "0",
              }}
            />
            <span
              style={{
                width: "40px",
                height: "20px",
                background: isNightMode ? "#4a5568" : "#cbd5e0",
                borderRadius: "10px",
                display: "inline-block",
                position: "relative",
                transition: "background 0.3s",
              }}
            >
              <span
                style={{
                  width: "16px",
                  height: "16px",
                  background: "white",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "2px",
                  left: isNightMode ? "22px" : "2px",
                  transition: "left 0.3s",
                }}
              />
            </span>
          </label>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: isNightMode ? "#e2e8f0" : "#2d3748",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Task Manager
          </h2>
          <Link
            to="/tasks/add"
            style={{
              background: isNightMode
                ? "linear-gradient(90deg, #4a5568, #718096)"
                : "linear-gradient(90deg, #4c51bf, #00c4cc)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              transition: "transform 0.3s, background 0.3s",
              ":hover": {
                transform: "scale(1.05)",
                background: isNightMode
                  ? "linear-gradient(90deg, #3c4251, #5a6777)"
                  : "linear-gradient(90deg, #3d44a0, #00a9b3)",
              },
            }}
          >
            Add Task
          </Link>
        </div>

        {/* Search Input */}
        <div
          style={{
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "300px",
              padding: "12px",
              border: "2px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "16px",
              background: "white",
              transition: "border-color 0.3s, box-shadow 0.3s",
              outline: "none",
              ":focus": {
                borderColor: isNightMode ? "#718096" : "#4c51bf",
                boxShadow: `0 0 5px rgba(${isNightMode ? "113, 134, 150" : "76, 81, 191"}, 0.5)`,
              },
              "@media (max-width: 640px)": {
                width: "100%",
              },
            }}
          />
        </div>

        {filteredTasks.length === 0 ? (
          <div
            style={{
              background: isNightMode ? "#2d3748" : "white",
              padding: "24px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              color: isNightMode ? "#e2e8f0" : "#718096",
            }}
          >
            No tasks available or matching your search.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
              "@media (max-width: 640px)": {
                width: "100%",
                overflowX: "scroll",
              },
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0 10px",
                background: isNightMode ? "#2d3748" : "white",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: isNightMode
                      ? "linear-gradient(90deg, #4a5568, #718096)"
                      : "linear-gradient(90deg, #4c51bf, #00c4cc)",
                    color: "white",
                  }}
                >
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Due Date
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Priority
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    style={{
                      transition: "background 0.3s",
                      ":hover": {
                        background: isNightMode ? "#4a5568" : "#f7fafc",
                      },
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #edf2f7",
                        color: isNightMode ? "#e2e8f0" : "#2d3748",
                      }}
                    >
                      {task.title}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #edf2f7",
                        color: isNightMode ? "#e2e8f0" : "#718096",
                      }}
                    >
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #edf2f7",
                        color: isNightMode ? "#e2e8f0" : "#718096",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            task.priority === "High"
                              ? isNightMode
                                ? "#fc8181"
                                : "#e53e3e"
                              : task.priority === "Medium"
                              ? isNightMode
                                ? "#f6ad55"
                                : "#ed8936"
                              : isNightMode
                              ? "#68d391"
                              : "#48bb78",
                        }}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #edf2f7",
                        color: isNightMode ? "#e2e8f0" : "#718096",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          color: task.status === "Completed"
                            ? isNightMode
                              ? "#68d391"
                              : "#48bb78"
                            : isNightMode
                            ? "#f6ad55"
                            : "#ed8936",
                        }}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #edf2f7",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        <Link
                          to={`/tasks/edit/${task._id}`}
                          style={{
                            background: isNightMode ? "#718096" : "#ecc94b",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "bold",
                            transition: "transform 0.3s",
                            ":hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(task._id)}
                          style={{
                            background: isNightMode ? "#90cdf4" : "#e53e3e",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "transform 0.3s",
                            ":hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleStatusToggle(task._id, task.status)}
                          style={{
                            background:
                              task.status === "Completed"
                                ? isNightMode
                                  ? "#a0aec0"
                                  : "#a0aec0"
                                : isNightMode
                                ? "#68d391"
                                : "#48bb78",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "transform 0.3s",
                            ":hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          {task.status === "Completed" ? "Mark Pending" : "Mark Completed"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;