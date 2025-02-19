import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";

interface ChildProfile {
  username: string;
  grade: string;
  years: number;
  subjects?: string[];
  profilePicture: string;
  role: string;
}

const ChildProfile: React.FC = () => {
  const [child, setChild] = useState<ChildProfile | null>(null);
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  useEffect(() => {
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      // Decode the JWT token
      const decodedToken: any = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);

      // Extract relevant fields from the decoded token
      const childProfile: ChildProfile = {
        username: decodedToken.username,
        grade: decodedToken.grade,
        years: decodedToken.years,
        subjects: decodedToken.subjects || [], // Optional, handle if subjects are missing
        profilePicture: decodedToken.profilePicture,
        role: decodedToken.role,
      };

      setChild(childProfile); // Set the decoded data into state
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [token]);

  if (!child) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-5">
      <img
        src={
          child.profilePicture
            ? `http://localhost:4000/${child.profilePicture.replace("\\", "/")}`
            : "https://via.placeholder.com/150"
        }
        alt="Profile"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
      <h2 className="text-center text-xl font-bold mt-3">{child.username}</h2>
      <p className="text-center text-gray-600">Role: {child.role}</p>
      <div className="mt-4">
        <p><strong>Grade:</strong> {child.grade}</p>
        <p><strong>Age:</strong> {child.years}</p>
        <p><strong>Subjects:</strong> {child.subjects?.length ? child.subjects.join(", ") : "No subjects available"}</p>
      </div>
    </div>
  );
};

export default ChildProfile;
