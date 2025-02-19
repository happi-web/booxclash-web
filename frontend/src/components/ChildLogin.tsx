import React, { useState, FC } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChildLogin: FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      alert("Please enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:4000/api/children/child-login", formData);

      // Store token in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "student");
      localStorage.setItem("username", data.user.username);

      // Redirect to student dashboard
      navigate("/student-dashboard");
    } catch (error: any) {
      console.error("Error during child login:", error);
      alert(error.response?.data?.message || "Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Child Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <button onClick={() => navigate("/login")}>Back to Login</button>
    </div>
  );
};

export default ChildLogin;
