import React, { useState, FC } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import NavBar from "./NavBar";

interface User {
  username: string;
  token: string; // Assuming the user receives a token on successful login/signup
  role: string;
}

interface LoginProps {
  setUser: (user: User) => void; // Function to update the user
}

const Login: FC<LoginProps> = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:4000/login", formData);
  
      // Log the token to confirm it is received
      console.log("Token received from server:", data.token);
  
      // Store the token for future use
      localStorage.setItem("token", data.token);
      console.log("Token stored in localStorage:", localStorage.getItem("token"));
  
      // Set the logged-in user
      setUser(data.user);
  
      // Redirect based on role after successful login
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error during login. Please try again.";
      console.error("Error during login:", error);
      alert(errorMessage);
    }
  };
  

  return (
    <>
    <NavBar/>
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
      <button onClick={handleLogin}>Log In</button>
      <button onClick={() => navigate("/signup")}>Don't have an account? Sign Up</button>
    </div>
    </>

  );
};

export default Login;
