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

function TeacherUpload() {
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
      {lessonPlans.map((plan, ) => (
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

export default TeacherUpload;
