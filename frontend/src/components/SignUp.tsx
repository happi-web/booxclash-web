import React, { useState, useEffect, FC } from "react";
import axios from "axios";
import  "./css/index.css";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

interface User {
  username: string;
  token: string;
  role: string;
}

interface SignupLoginProps {
  setUser: (user: User) => void;
}

const SignUp: FC<SignupLoginProps> = ({ setUser }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "parent", // Default role changed to parent
    country: "",
    state: "",
    profilePicture: null as File | null,
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [countries, setCountries] = useState<{ name: string; cca2: string }[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch ADMIN_SECRET from .env
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || "";


  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const sortedCountries = response.data
          .map((country: { name: { common: string }; cca2: string }) => ({
            name: country.name.common,
            cca2: country.cca2,
          }))
          .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountryCode) {
      setStates([]);
      return;
    }
    setStates([]);
  }, [selectedCountryCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData((prev) => {
      let updatedRole = prev.role;
  
      // Ensure the role updates when the dropdown changes
      if (name === "role") {
        updatedRole = value;
      }
  
      if (name === "password") {
        if (value === ADMIN_SECRET) {
          updatedRole = "admin";
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
  
      return {
        ...prev,
        [name]: value,
        role: updatedRole, // Ensure role updates properly
      };
    });
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, profilePicture: files[0] }));
    }
  };

  const handleSignup = async () => {
    try {
      const payload = new FormData();
      payload.append("username", formData.username);
      payload.append("password", formData.password);
      payload.append("role", formData.role);
      payload.append("country", formData.country);
      payload.append("state", formData.state);
      if (formData.profilePicture) {
        payload.append("profilePicture", formData.profilePicture);
      }

      const { data } = await axios.post("http://localhost:4000/signup", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(data.user);
      navigate("/login");
    } catch (error: any) {
      console.error("Error during signup:", error);
      alert(error.response?.data?.message || "Error during signup. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <div className="formData">
        <h2>Sign Up</h2>
        <div className="username">
          <label htmlFor="username">Username</label>
          <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          />
        </div>
        <div className="password">
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style={{
                paddingRight: "50px", // Make room for the button inside the input field
              }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#007bff", // Optional: to style the button color
              }}
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Hide role selection if ADMIN_SECRET is entered */}
        <div className="role">
          <label htmlFor="role">What is your role?</label>
          {!isAdmin && (
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>
        )}
        </div>
        <div className="country">
          <label htmlFor="country">Enter Country of Residence</label>
          <select
          name="country"
          value={selectedCountryCode}
          onChange={(e) => {
            setSelectedCountryCode(e.target.value);
            setFormData((prev) => ({
              ...prev,
              country: countries.find((c) => c.cca2 === e.target.value)?.name || "",
              state: "",
            }));
          }}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.cca2} value={country.cca2}>
              {country.name}
            </option>
          ))}
        </select>
        {!!states.length && (
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">Select State</option>
            {states.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        )}
        </div>
          <div className="profilePicture">
            <label htmlFor="profilePicture">Upload Your Profile Picture</label>
            <input type="file" name="profilePicture" onChange={handleFileChange} />
          </div>
          <div className="signupBtn">
          <button onClick={handleSignup}>Sign Up</button>
          <button onClick={() => navigate("/login")}>Already have an account? Log In</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
