import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (userRole) => {
    if (!credentials.username || !credentials.password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: credentials.username, password: credentials.password, role: userRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setError("");
      navigate("/campus-selection", { state: { role: userRole } });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1>College Portal</h1>
        <p>Welcome to the College Management System</p>
      </div>

      <div style={styles.container}>
        <div style={styles.loginContainer}>
          {/* Admin Login Box */}
          <div style={styles.loginBox}>
            <h2>Admin Login</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="User Name"
                style={styles.input}
                value={role === "admin" ? credentials.username : ""}
                onChange={(e) => {
                  setRole("admin");
                  setCredentials({ ...credentials, username: e.target.value });
                }}
              />
              <input
                type="password"
                placeholder="Password"
                style={styles.input}
                value={role === "admin" ? credentials.password : ""}
                onChange={(e) => {
                  setRole("admin");
                  setCredentials({ ...credentials, password: e.target.value });
                }}
              />
              {error && role === "admin" && <p style={styles.error}>{error}</p>}
              <button type="button" style={styles.button} onClick={() => handleLogin("admin")}>
                Login as Admin
              </button>
            </form>
          </div>

          {/* Student Login Box */}
          <div style={styles.loginBox}>
            <h2>Student Login</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="User Name"
                style={styles.input}
                value={role === "student" ? credentials.username : ""}
                onChange={(e) => {
                  setRole("student");
                  setCredentials({ ...credentials, username: e.target.value });
                }}
              />
              <input
                type="password"
                placeholder="Password"
                style={styles.input}
                value={role === "student" ? credentials.password : ""}
                onChange={(e) => {
                  setRole("student");
                  setCredentials({ ...credentials, password: e.target.value });
                }}
              />
              {error && role === "student" && <p style={styles.error}>{error}</p>}
              <button type="button" style={styles.button} onClick={() => handleLogin("student")}>
                Login as Student
              </button>
            </form>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <p>&copy; 2025 College Portal. All rights reserved.</p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", minHeight: "100vh" },
  header: { backgroundColor: "#800080", color: "white", textAlign: "center", padding: "50px 0", width: "100%" },
  container: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1 },
  loginContainer: { display: "flex", justifyContent: "center", gap: "20px", margin: "10px 0", marginTop: "50px" },
  loginBox: { backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "20px", width: "280px", textAlign: "center" },
  input: { width: "100%", padding: "8px", margin: "8px 0", border: "1px solid #ccc", borderRadius: "4px" },
  button: { backgroundColor: "#800080", color: "white", border: "none", padding: "10px", borderRadius: "4px", cursor: "pointer", width: "100%", fontSize: "16px" },
  error: { color: "red", fontSize: "12px", marginBottom: "8px" },
  footer: { textAlign: "center", fontSize: "12px", color: "#666", width: "100%", padding: "10px 0" },
};

export default LoginPage;
