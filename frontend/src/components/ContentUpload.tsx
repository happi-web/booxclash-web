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
//       setContent(content.filter((item) => item._id !== id)); // Update state after delete
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
//         {content.map((item) => (
//           <li key={item._id}>
//             <h2>{item.title}</h2>
//             <p>{item.description}</p>
//             <p>Type: {item.type}</p>
//             {item.type === "flashcard" && item.filePath ? (
//               <img
//                 src={`http://localhost:4000/${item.filePath}`}
//                 alt={item.title}
//                 style={{ maxWidth: "300px", maxHeight: "200px" }}
//               />
//             ) : (
//               <a href={item.embedLink} target="_blank" rel="noopener noreferrer">
//                 View Content
//               </a>
//             )}
//             <button onClick={() => handleDelete(item._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ContentUpload;

import { useState, useEffect, ChangeEvent } from "react";

interface LessonPlan {
  _id: string; // Unique identifier (_id is still used in the backend for deletion)
  gradeLevel: string;
  subject: string;
  topic: string; // Topic field (not unique, just for additional information)  
  lesson: string; // Use 'lesson' as the unique identifier
  duration: string;
  learningObjectives: string;
  materialsNeeded: string;
  introduction: string;
  lessonPresentation: string;
  interactiveActivity: string;
  questionAnswerSession: string;
  videoLink: string;
  gameDescription: string;
  quizLink: string;
  gamesLink: string;
  conclusion: string;
  flashcards: File[]; // Flashcard files (images)
}

const initialFormData: LessonPlan = {
  _id: "",  // Keep _id but not used in upload
  gradeLevel: "5",
  subject: "Science",  
  topic: "The Water Cycle",  // Topic is added for more details
  lesson: "Water Cycle Lesson",  // Lesson is the unique identifier now
  duration: "60 minutes",
  learningObjectives: "",
  materialsNeeded: "",
  introduction: "",
  lessonPresentation: "",
  interactiveActivity: "",
  questionAnswerSession: "",
  videoLink: "",
  gameDescription: "",
  quizLink: "",
  gamesLink: "",
  conclusion: "",
  flashcards: [], // Initialize flashcards
};

function ContentUpload() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [formData, setFormData] = useState<LessonPlan>(initialFormData);
  const [isUploading, setIsUploading] = useState(false); // Use state for uploading status
  const [flashcardURLs, setFlashcardURLs] = useState<string[]>([]);

  useEffect(() => {
    fetchLessonPlans();
  }, []);

  const fetchLessonPlans = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/lessons", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lesson plans.");
      }

      const data: LessonPlan[] = await response.json();
      setLessonPlans(data);
    } catch (error) {
      handleError(error, "Error fetching lesson plans");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileURLs = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setFlashcardURLs(fileURLs);
      setFormData((prev) => ({ ...prev, flashcards: Array.from(files) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToUpload = new FormData();

    // Append flashcard files to the form data (images for flashcards)
    formData.flashcards.forEach((file) => {
      formDataToUpload.append("flashcards", file);  // Ensure field name is "flashcards"
    });

    // Append other form data (no change in lesson data)
    formDataToUpload.append("gradeLevel", formData.gradeLevel);
    formDataToUpload.append("subject", formData.subject);    
    formDataToUpload.append("topic", formData.topic);    // Send topic as additional information
    formDataToUpload.append("lesson", formData.lesson);  // Send lesson as the unique identifier
    formDataToUpload.append("duration", formData.duration);
    formDataToUpload.append("learningObjectives", formData.learningObjectives);
    formDataToUpload.append("materialsNeeded", formData.materialsNeeded);
    formDataToUpload.append("introduction", formData.introduction);
    formDataToUpload.append("lessonPresentation", formData.lessonPresentation);
    formDataToUpload.append("interactiveActivity", formData.interactiveActivity);
    formDataToUpload.append("questionAnswerSession", formData.questionAnswerSession);
    formDataToUpload.append("videoLink", formData.videoLink);
    formDataToUpload.append("gameDescription", formData.gameDescription);
    formDataToUpload.append("quizLink", formData.quizLink);
    formDataToUpload.append("gamesLink", formData.gamesLink);
    formDataToUpload.append("conclusion", formData.conclusion);

    try {
      setIsUploading(true);
      const response = await fetch("http://localhost:4000/api/upload-lesson", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToUpload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Upload failed: ${errorText}`);
        return;
      }

      const result = await response.json();
      console.log(result);
      setIsUploading(false);
      fetchLessonPlans(); // Reload lesson plans after a successful upload
    } catch (error) {
      setIsUploading(false);
      console.error("Upload error:", error);
      alert("An error occurred while uploading the lesson plan.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleError = (error: unknown, message: string) => {
    if (error instanceof Error) {
      console.error(message, error.message);
      alert(`${message}: ${error.message}`);
    } else {
      console.error(message, error);
      alert("An unexpected error occurred.");
    }
  };

  const handleDelete = async (plan: LessonPlan) => {
    try {
      const response = await fetch(`http://localhost:4000/api/lessons/${plan.lesson}`, {  // Delete by lesson
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Delete failed: ${errorText}`);
        return;
      }

      alert("Lesson Plan deleted successfully!");
      setLessonPlans((prev) => prev.filter((p) => p.lesson !== plan.lesson)); // Filter by lesson
    } catch (error) {
      handleError(error, "Error during deletion");
    }
  };

  // Render flashcards with URLs
  const renderFlashcards = () => (
    <ul>
      {flashcardURLs.length > 0 ? (
        flashcardURLs.map((url, index) => (
          <li key={index}>
            <img src={url} alt={`Flashcard ${index + 1}`} width="100" />
            <p>Flashcard {index + 1}</p>
          </li>
        ))
      ) : (
        <p>No flashcards uploaded yet.</p>
      )}
    </ul>
  );

  const renderLessonPlans = () => (
    <ul>
      {lessonPlans.map((plan, index) => (
        <li key={plan._id}>
          <h2>{plan.lesson}</h2>  {/* Display the lesson name */}
          <p><strong>Topic:</strong> {plan.topic}</p>
          <p><strong>Grade Level:</strong> {plan.gradeLevel}</p>
          <p><strong>Subject:</strong> {plan.subject}</p>
          <p><strong>Duration:</strong> {plan.duration}</p>
          <p><strong>Learning Objectives:</strong> {plan.learningObjectives}</p>
          <p><strong>Materials Needed:</strong> {plan.materialsNeeded}</p>
          <p><strong>Introduction:</strong> {plan.introduction}</p>
          <p><strong>Lesson Presentation:</strong> {plan.lessonPresentation}</p>
          <p><strong>Interactive Activity:</strong> {plan.interactiveActivity}</p>
          <p><strong>Question and Answer Session:</strong> {plan.questionAnswerSession}</p>
          <p><strong>Video Link:</strong> <a href={plan.videoLink} target="_blank" rel="noopener noreferrer">{plan.videoLink}</a></p>
          <p><strong>Game Description:</strong> {plan.gameDescription}</p>
          <p><strong>Quiz Link:</strong> <a href={plan.quizLink} target="_blank" rel="noopener noreferrer">{plan.quizLink}</a></p>
          <p><strong>Conclusion:</strong> {plan.conclusion}</p>
          <p><strong>Flashcards:</strong></p>
          <ul>
            {plan.flashcards.length ? (
              plan.flashcards.map((flashcard, index) => (
                <li key={index}>
                  {/* Check if flashcard is a URL or File */}
                  <img
                    src={typeof flashcard === 'string' ? flashcard : URL.createObjectURL(flashcard)}
                    alt={`Flashcard ${index + 1}`}
                    width="100"
                  />
                  <p>Flashcard {index + 1}</p>
                </li>
              ))
            ) : (
              <p>No flashcards uploaded for this lesson plan.</p>
            )}
          </ul>
          <button onClick={() => handleDelete(plan)}>Delete</button>
        </li>
      ))}
    </ul>
  );
  

  return (
    <div>
      <h1>Upload Lesson Plan with Flashcards</h1>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => {
          if (key === "flashcards") return null;

          const label = key.replace(/([A-Z])/g, " $1").toUpperCase();
          return (
            <div key={key}>
              <label>{label}</label>
              {key === "lesson" || key === "topic" ? (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                />
              ) : key.includes("Link") ? (
                <input
                  type="url"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                />
              ) : (
                <textarea
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          );
        })}
        <div>
          <label>FLASHCARDS (Upload Images)</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          {renderFlashcards()}
        </div>
        <button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Lesson Plan"}
        </button>
      </form>

      <h1>Uploaded Lesson Plans</h1>
      {lessonPlans.length > 0 ? renderLessonPlans() : <p>No lesson plans uploaded yet.</p>}
    </div>
  );
}

export default ContentUpload;
