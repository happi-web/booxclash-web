import { useState, useEffect, ChangeEvent } from "react";
import "./css/lessons.css";

interface LessonPlan {
  gradeLevel: string;
  subject: string;
  topic: string;
  lesson: string;
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
  flashcards: string[];
}

const initialFormData: LessonPlan = {
  gradeLevel: "5",
  subject: "Science",
  topic: "The Water Cycle",
  lesson: "Water Cycle Lesson",
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
  flashcards: [],
};

function TeacherUpload() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [formData, setFormData] = useState<LessonPlan>(initialFormData);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      console.error("Error fetching lesson plans", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToUpload = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "flashcards") {
        formDataToUpload.append(key, value);
      }
    });

    // Append files
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        formDataToUpload.append("flashcards", file);
      });
    }

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

      // Reset form
      setFormData(initialFormData);
      setSelectedFiles(null);
      setIsUploading(false);
      fetchLessonPlans();
    } catch (error) {
      setIsUploading(false);
      console.error("Upload error:", error);
      alert("An error occurred while uploading the lesson plan.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleDelete = async (lesson: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/lessons/${lesson}`, {
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
      setLessonPlans((prev) => prev.filter((plan) => plan.lesson !== lesson));
    } catch (error) {
      console.error("Error during deletion", error);
    }
  };

  const renderLessonPlans = () => (
    <ul className="lesson-plan-row">
      {lessonPlans.map((plan) => (
        <li key={plan.lesson} className="lesson-plan-item">
          <h2>{plan.lesson}</h2>
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
          
          {/* Games Link */}
          {plan.gamesLink && (
            <p><strong>Game Link:</strong> <a href={plan.gamesLink} target="_blank" rel="noopener noreferrer">{plan.gamesLink}</a></p>
          )}

          <p><strong>Quiz Link:</strong> <a href={plan.quizLink} target="_blank" rel="noopener noreferrer">{plan.quizLink}</a></p>
          <p><strong>Conclusion:</strong> {plan.conclusion}</p>

          {/* Flashcards Section */}
          {plan.flashcards && plan.flashcards.length > 0 && (
            <>
              <p><strong>Flashcards:</strong></p>
              <ul className="flashcard-list">
                {plan.flashcards.map((flashcard, index) => (
                  <li key={index}>
                    <img src={`http://localhost:4000/${flashcard}`} alt={`Flashcard ${index + 1}`} width="100" />
                  </li>
                ))}
              </ul>
            </>
          )}

          <button onClick={() => handleDelete(plan.lesson)}>Delete</button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container">
      <h1>Upload Lesson Plan</h1>
      <form onSubmit={handleSubmit} className="lesson-plan-item">
        <div>
          <label>Grade Level</label>
          <select name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} required>
            {Array.from({ length: 8 }, (_, i) => i + 5).map((grade) => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Subject</label>
          <select name="subject" value={formData.subject} onChange={handleChange} required>
            <option value="Science">Science</option>
            <option value="Math">Math</option>
          </select>
        </div>

        <div>
          <label>Upload Flashcards</label>
          <input type="file" multiple accept="image/*" onChange={handleFileUpload} />
        </div>

        {/* Removed the textarea for gradeLevel */}
        {Object.keys(initialFormData).filter(field => field !== "flashcards" && field !== "gradeLevel").map((field) => (
          <div key={field}>
            <label>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</label>
            <textarea name={field} value={formData[field as keyof LessonPlan]} onChange={handleChange} required />
          </div>
        ))}

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
