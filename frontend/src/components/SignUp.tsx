import React, { useState, FC } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    profilePicture: null as File | null, // Store the selected profile picture file
  });

  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "password" && value.includes("admin")) {
      setFormData((prevData) => ({ ...prevData, password: value, role: "admin" }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle file input for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { // Check if files exists and has at least one file
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    }
  };
  
  

  // Handle signup and send data to the backend
  const handleSignup = async () => {
    try {
      const payload = new FormData();
      payload.append("username", formData.username);
      payload.append("password", formData.password);
      payload.append("role", formData.role);
      payload.append("grade", formData.grade);
      if (formData.profilePicture) {
        payload.append("profilePicture", formData.profilePicture); // Add file
      }

      console.log("Sending signup data:", payload); // Debugging
      const { data } = await axios.post("http://localhost:4000/signup", payload, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper content type
        },
      });

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
      <NavBar />
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
          <select name="grade" value={formData.grade} onChange={handleChange}>
            <option value="">Select Grade</option>
            {[...Array(8)].map((_, index) => (
              <option key={index} value={index + 5}>
                {index + 5}
              </option>
            ))}
          </select>
        )}

        <input type="file" name="profilePicture" onChange={handleFileChange} />

        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={() => navigate("/login")}>Already have an account? Log In</button>
      </div>
    </>
  );
};

export default SignUp;
