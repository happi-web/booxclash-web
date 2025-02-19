import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

interface NewChild {
  username: string; // Changed name to username
  grade: string;
  years: string;
  subjects: string[];
  password: string;
  profilePicture: File | string; // Allow both File and string types (for uploading and displaying)
  role: string; // Default role set to "student"
}

const RegisterChild = () => {
  const [newChild, setNewChild] = useState<NewChild>({
    username: "", // Changed name to username
    grade: "",
    years: "",
    subjects: [],
    password: "",
    profilePicture: "",
    role: "student",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate(); // Hook to navigate

  const handleCheckboxChange = (subject: string) => {
    setNewChild((prevChild) => {
      const subjects = prevChild.subjects.includes(subject)
        ? prevChild.subjects.filter((s) => s !== subject)
        : [...prevChild.subjects, subject];
      return { ...prevChild, subjects };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewChild((prevChild) => ({ ...prevChild, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewChild((prevChild) => ({
        ...prevChild,
        profilePicture: file,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check for existing children with the same username and grade
      const checkResponse = await fetch("http://localhost:4000/api/children");
      if (!checkResponse.ok) throw new Error("Error checking existing children");

      const { children } = await checkResponse.json();
      const isDuplicate = children.some(
        (child: any) => child.username === newChild.username && child.grade === newChild.grade // Changed name to username
      );

      if (isDuplicate) {
        alert("A child with the same username and grade is already registered.");
        setIsSubmitting(false);
        return;
      }

      // Submit the new child registration
      const formData = new FormData();
      formData.append("username", newChild.username); // Changed name to username
      formData.append("grade", newChild.grade);
      formData.append("years", newChild.years.toString());
      formData.append("subjects", JSON.stringify(newChild.subjects));
      formData.append("password", newChild.password);
      formData.append("profilePicture", newChild.profilePicture instanceof File ? newChild.profilePicture : "");

      const response = await fetch("http://localhost:4000/api/children/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Assuming the backend returns a token after successful registration
        const token = data.token;
        if (token) {
          localStorage.setItem("token", token); // Save the token to localStorage
          console.log("Token saved to localStorage:", token);
        }

        alert("Child registered successfully!");

        // Redirect to the Parent Dashboard
        navigate("/parent-dashboard"); // Navigate back to the ParentDashboard
      } else {
        alert("Error registering child");
      }
    } catch (error) {
      alert("Error registering child");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Register New Child</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Username:</label> {/* Changed label to Username */}
          <input type="text" name="username" value={newChild.username} onChange={handleInputChange} required /> {/* Changed name to username */}
        </div>
        <div>
          <label>Grade:</label>
          <input type="text" name="grade" value={newChild.grade} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" name="years" value={newChild.years} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Subjects:</label>
          <div>
            <label>
              <input
                type="checkbox"
                checked={newChild.subjects.includes("Math")}
                onChange={() => handleCheckboxChange("Math")}
              />
              Math
            </label>
            <label>
              <input
                type="checkbox"
                checked={newChild.subjects.includes("Science")}
                onChange={() => handleCheckboxChange("Science")}
              />
              Science
            </label>
          </div>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={newChild.password} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          {newChild.profilePicture && (
            <img
              src={typeof newChild.profilePicture === "string"
                ? newChild.profilePicture
                : URL.createObjectURL(newChild.profilePicture)}
              alt="Preview"
              width="50"
            />
          )}
        </div>
        <button type="submit" disabled={isSubmitting} className="button">
          {isSubmitting ? "Submitting..." : "Register Child"}
        </button>
      </form>
    </div>
  );
};

export default RegisterChild;
