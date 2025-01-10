// import { useState, useEffect, ChangeEvent, FormEvent } from "react";

// function ContentUpload() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     type: "video",
//     audience: "students",
//     tags: "",
//     embedLink: "",
//     file: null as File | null,
//   });
//   const [isUploading, setIsUploading] = useState(false);
//   type ContentItem = {
//     _id: string;
//     title: string;
//     description: string;
//     type: string;
//     embedLink?: string;
//     filePath?: string;
//   };
  
//   const [content, setContent] = useState<ContentItem[]>([]);
//   // Fetch existing content on load
//   useEffect(() => {
//     const fetchContent = async () => {
//       try {
//         const response = await fetch("http://localhost:4000/api/content");
//         const data = await response.json();
//         setContent(data);
//       } catch (err) {
//         console.error("Error fetching content:", err);
//       }
//     };

//     fetchContent();
//   }, []);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFormData({ ...formData, file: e.target.files[0] });
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsUploading(true);

//     const form = new FormData();
//     form.append("title", formData.title);
//     form.append("description", formData.description);
//     form.append("type", formData.type);
//     form.append("audience", formData.audience);
//     form.append("tags", formData.tags);

//     if (["video", "simulation", "ar-vr"].includes(formData.type)) {
//       form.append("embedLink", formData.embedLink);
//     } else if (formData.type === "flashcard" && formData.file) {
//       form.append("file", formData.file);
//     }

//     try {
//       const response = await fetch("http://localhost:4000/api/upload-content", {
//         method: "POST",
//         body: form,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         alert(`Upload failed: ${errorText}`);
//       } else {
//         const result = await response.json();
//         setContent((prev) => [...prev, result.content]); // Add new content to the list
//         alert("Content uploaded successfully!");
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("An error occurred during upload.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`http://localhost:4000/api/content/${id}`, { method: "DELETE" });
//       setContent(content.filter((item: any) => item._id !== id)); // Update state after delete
//     } catch (err) {
//       console.error("Error deleting content:", err);
//     }
//   };

//   return (
//     <div>
//       <h1>Content Upload</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           name="title"
//           placeholder="Title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//         />
//         <select name="type" value={formData.type} onChange={handleChange}>
//           <option value="video">Video</option>
//           <option value="flashcard">Flashcard</option>
//           <option value="simulation">Simulation</option>
//           <option value="ar-vr">AR/VR</option>
//         </select>
//         <select name="audience" value={formData.audience} onChange={handleChange}>
//           <option value="students">Students</option>
//           <option value="teachers">Teachers</option>
//         </select>
//         {["video", "simulation", "ar-vr"].includes(formData.type) ? (
//           <input
//             type="url"
//             name="embedLink"
//             placeholder="Embed Link"
//             value={formData.embedLink}
//             onChange={handleChange}
//             required
//           />
//         ) : formData.type === "flashcard" ? (
//           <input
//             type="file"
//             name="file"
//             accept="application/pdf,image/*"
//             onChange={handleFileChange}
//             required
//           />
//         ) : null}
//         <input
//           name="tags"
//           placeholder="Tags (comma-separated)"
//           value={formData.tags}
//           onChange={handleChange}
//         />
//         <button type="submit" disabled={isUploading}>
//           {isUploading ? "Uploading..." : "Upload"}
//         </button>
//       </form>

//       <h1>Uploaded Content</h1>
//       <ul>
//         {content.map((item: any) => (
//           <li key={item._id}>
//             <h2>{item.title}</h2>
//             <p>{item.description}</p>
//             <p>Type: {item.type}</p>
//             {item.type === "flashcard" ? (
//               <a href={`http://localhost:4000/${item.filePath}`} download>
//                 Download Flashcard
//               </a>
//             ) : (
//               <a href={item.embedLink} target="_blank" rel="noopener noreferrer">
//                 View Content
//               </a>
//             )}
//             <button onClick={() => handleDelete(item._id)}>Delete</button>
//             {/* Add edit functionality here */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ContentUpload;

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

function ContentUpload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video",
    audience: "students",
    tags: "",
    embedLink: "",
    file: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);

  type ContentItem = {
    _id: string;
    title: string;
    description: string;
    type: string;
    embedLink?: string;
    filePath?: string;
  };

  const [content, setContent] = useState<ContentItem[]>([]);

  // Fetch existing content on load
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/content");
        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };

    fetchContent();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("type", formData.type);
    form.append("audience", formData.audience);
    form.append("tags", formData.tags);

    if (["video", "simulation", "ar-vr"].includes(formData.type)) {
      form.append("embedLink", formData.embedLink);
    } else if (formData.type === "flashcard" && formData.file) {
      form.append("file", formData.file);
    }

    try {
      const response = await fetch("http://localhost:4000/api/upload-content", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Upload failed: ${errorText}`);
      } else {
        const result = await response.json();
        setContent((prev) => [...prev, result.content]); // Add new content to the list
        alert("Content uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/api/content/${id}`, { method: "DELETE" });
      setContent(content.filter((item) => item._id !== id)); // Update state after delete
    } catch (err) {
      console.error("Error deleting content:", err);
    }
  };

  return (
    <div>
      <h1>Content Upload</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="video">Video</option>
          <option value="flashcard">Flashcard</option>
          <option value="simulation">Simulation</option>
          <option value="ar-vr">AR/VR</option>
        </select>
        <select name="audience" value={formData.audience} onChange={handleChange}>
          <option value="students">Students</option>
          <option value="teachers">Teachers</option>
        </select>
        {["video", "simulation", "ar-vr"].includes(formData.type) ? (
          <input
            type="url"
            name="embedLink"
            placeholder="Embed Link"
            value={formData.embedLink}
            onChange={handleChange}
            required
          />
        ) : formData.type === "flashcard" ? (
          <input
            type="file"
            name="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            required
          />
        ) : null}
        <input
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
        />
        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <h1>Uploaded Content</h1>
      <ul>
        {content.map((item) => (
          <li key={item._id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p>Type: {item.type}</p>
            {item.type === "flashcard" && item.filePath ? (
              <img
                src={`http://localhost:4000/${item.filePath}`}
                alt={item.title}
                style={{ maxWidth: "300px", maxHeight: "200px" }}
              />
            ) : (
              <a href={item.embedLink} target="_blank" rel="noopener noreferrer">
                View Content
              </a>
            )}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContentUpload;
