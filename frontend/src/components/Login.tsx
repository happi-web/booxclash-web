import React, { useState, FC } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

interface User {
  username: string;
  token: string;
  role: string;
}

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: FC<LoginProps> = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    setLoading(true); // Start loading
    try {
      const { data } = await axios.post("http://localhost:4000/login", formData);
  
      console.log("Token received from server:", data.token);
  
      // Store user details in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("username", data.user.username);
  
      // Set user state
      setUser(data.user);
  
      // Redirect user based on role
      switch (data.user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "student":  
          navigate("/student-dashboard");
          break;
        default:
          navigate("/parent-dashboard"); 
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      alert(error.response?.data?.message || "Error during login. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <NavBar />
      <div>
        <h2>Log In</h2>
        <input 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          placeholder="Username" 
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="Password" 
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
        <button onClick={() => navigate("/signup")}>
          Don't have an account? Sign Up
        </button>
        <button onClick={() => navigate("/child-login")}>
          Child Login
        </button>
      </div>
    </>
  );
};

export default Login;
