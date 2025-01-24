import React, { useState, useEffect, FC } from "react";
import axios from "axios";
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
    role: "student",
    grade: "",
    country: "",
    state: "",
    profilePicture: null as File | null,
  });

  const [countries, setCountries] = useState<{ name: string; cca2: string }[]>([]);
  const [states, setStates] = useState<string[]>([]); // To handle states
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false); // To control password visibility
  const navigate = useNavigate();

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const sortedCountries = response.data
          .map((country: { name: { common: string }; cca2: string }) => ({
            name: country.name.common,
            cca2: country.cca2,
          }))
          .sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name)); // Sorting countries alphabetically

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Handle country selection and update form data accordingly
  useEffect(() => {
    if (!selectedCountryCode) {
      setStates([]); // Reset states when no country is selected
      return;
    }

    // For the REST Countries API, state/province data may not be available directly
    // You can modify it to fetch states from a different API if needed
    setStates([]); // For now, assuming no states are available
  }, [selectedCountryCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Extract files to a constant
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
      payload.append("grade", formData.grade);
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
      const errorMessage = error.response?.data?.message || "Error during signup. Please try again.";
      console.error("Error during signup:", error);
      alert(errorMessage);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
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
        <div style={{ position: "relative" }}>
          <input
            type={passwordVisible ? "text" : "password"} // Toggle between password and text
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
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
            }}
          >
            {passwordVisible ? "Hide" : "Show"} {/* Display show or hide based on visibility */}
          </button>
        </div>

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        {formData.role === "student" && (
          <select name="grade" value={formData.grade} onChange={handleChange}>
            <option value="">Select Grade</option>
            {[...Array(8)].map((_, index) => (
              <option key={index} value={index + 5}>
                Grade {index + 5}
              </option>
            ))}
          </select>
        )}

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

        <input type="file" name="profilePicture" onChange={handleFileChange} />

        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={() => navigate("/login")}>Already have an account? Log In</button>
      </div>
    </>
  );
};

export default SignUp;
