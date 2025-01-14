import { useState, useEffect, ChangeEvent } from "react";
import "./css/lessons.css";

interface LessonPlan {
  gradeLevel: string;
  subject: string;
  topic: string; // Topic field
  lesson: string; // Lesson as the unique identifier
  duration: string;
  learningObjectives: string;
  materialsNeeded: string;
  introduction: string;
  imageUrl?: string; 
  lessonPresentation: string;
  interactiveActivity: string;
  questionAnswerSession: string;
  videoLink: string;
  gameDescription: string;
  quizLink: string;
  gamesLink: string;
  conclusion: string;
}

const initialFormData: LessonPlan = {
  gradeLevel: "5",
  subject: "Science",
  topic: "The Water Cycle",  // Topic for more details
  lesson: "Water Cycle Lesson",  // Lesson as unique identifier
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
};

function TeacherUpload() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [formData, setFormData] = useState<LessonPlan>(initialFormData);
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

    // Append other form data (lesson data)
    formDataToUpload.append("gradeLevel", formData.gradeLevel);
    formDataToUpload.append("subject", formData.subject);
    formDataToUpload.append("topic", formData.topic);
    formDataToUpload.append("lesson", formData.lesson);
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

      // After successful upload, reset the form
      setFormData(initialFormData);
      setIsUploading(false);
      fetchLessonPlans(); // Reload lesson plans after upload
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
          <p><strong>Quiz Link:</strong> <a href={plan.quizLink} target="_blank" rel="noopener noreferrer">{plan.quizLink}</a></p>
          <p><strong>Conclusion:</strong> {plan.conclusion}</p>
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
            <option value="5">Grade 5</option>
            <option value="6">Grade 6</option>
            <option value="7">Grade 7</option>
            <option value="8">Grade 8</option>
            <option value="9">Grade 9</option>
            <option value="10">Grade 10</option>
            <option value="11">Grade 11</option>
            <option value="12">Grade 12</option>
          </select>
        </div>

        <div>
          <label>Subject</label>
          <select name="subject" value={formData.subject} onChange={handleChange} required>
            <option value="Science">Science</option>
            <option value="Math">Math</option>
          </select>
        </div>

        {["topic", "lesson", "duration", "learningObjectives", "materialsNeeded", "introduction", "lessonPresentation", "interactiveActivity", "questionAnswerSession", "videoLink", "gameDescription", "quizLink", "gamesLink", "conclusion"].map((field) => (
          <div key={field}>
            <label>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</label>
            {field.includes("Link") ? (
              <input
                type="url"
                name={field}
                value={formData[field as keyof LessonPlan]}
                onChange={handleChange}
                required
              />
            ) : (
              <textarea
                name={field}
                value={formData[field as keyof LessonPlan]}
                onChange={handleChange}
                required
              />
            )}
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
