// // frontend/components/Profile.tsx

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface Profile {
//   username: string;
//   role: string;
//   profilePicture?: string;
//   grade?: string;
// }

// const Profile = () => {
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get<Profile>("http://localhost:4000/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProfile(response.data);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         setMessage("Failed to load profile.");
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const uploadProfilePicture = async () => {
//     if (!selectedFile) {
//       setMessage("Please select a file to upload.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("profilePicture", selectedFile);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put<{ message: string; user: Profile }>(
//         "http://localhost:4000/profile/picture",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data", // Important for file uploads
//           },
//         }
//       );

//       setMessage(response.data.message);
//       setProfile(response.data.user);
//     } catch (error: any) {
//       console.error("Error uploading profile picture:", error.response?.data || error.message);
//       setMessage(error.response?.data?.message || "Error uploading profile picture.");
//     }
//   };

//   if (!profile) return <p>Loading profile...</p>;

//   return (
//     <div>
//       <h1>Profile</h1>
//       <img
//         src={profile.profilePicture || "https://via.placeholder.com/150"}
//         alt="Profile"
//         style={{ width: "150px", height: "150px", borderRadius: "50%" }}
//       />
//       <p>Username: {profile.username}</p>
//       <p>Role: {profile.role}</p>
//       {profile.grade && <p>Grade: {profile.grade}</p>}  {/* Only show grade if available */}
//       <input type="file" accept="image/*" onChange={handleFileChange} />
//       <button onClick={uploadProfilePicture}>Update Profile Picture</button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Profile {
  username: string;
  role: string;
  profilePicture?: string;
  grade?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<Profile>("http://localhost:4000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadProfilePicture = async () => {
    if (!selectedFile) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put<{ message: string; user: Profile }>(
        "http://localhost:4000/profile/picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);
      setProfile(response.data.user); // Update profile with new picture
    } catch (error: any) {
      console.error("Error uploading profile picture:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error uploading profile picture.");
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <img
        src={
          profile.profilePicture
            ? `http://localhost:4000/${profile.profilePicture.replace("\\", "/")}`
            : "https://via.placeholder.com/150"
        }
        alt="Profile"
        style={{ width: "150px", height: "150px", borderRadius: "50%" }}
      />
      <p>Username: {profile.username}</p>
      <p>Role: {profile.role}</p>
      {profile.grade && <p>Grade: {profile.grade}</p>}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={uploadProfilePicture}>Update Profile Picture</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Profile;
