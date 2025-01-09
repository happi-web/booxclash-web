import React, { useState, FC } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import NavBar from "./NavBar";

// Define the User interface
interface User {
  username: string;
  token: string;
  role: string;
}

interface SignupLoginProps {
  setUser: (user: User) => void; // Function to update the user
}

const SignUp: FC<SignupLoginProps> = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student", // Default to 'student'
    grade: "", // Only applicable for students
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Automatically assign 'admin' role if the password contains 'admin'
    if (name === "password" && value.includes("admin")) {
      setFormData({ ...formData, password: value, role: "admin" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async () => {
    try {
      console.log("Sending signup data:", formData); // Log form data being sent
      const { data } = await axios.post("http://localhost:4000/signup", formData);
      setUser(data.user); // Set the signed-up user

      // Redirect to login page after successful signup
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error during signup. Please try again.";
      console.error("Error during signup:", error); // Log the error object
      alert(errorMessage);
    }
  };

  return (
    <>
    <NavBar/>
    <div>
      <h2>Sign Up</h2>
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
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      {formData.role === "student" && (
        <input
          type="text"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          placeholder="Grade"
        />
      )}
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={() => navigate("/login")}>Already have an account? Log In</button>
    </div>
    </>
    
  );
};

export default SignUp;
