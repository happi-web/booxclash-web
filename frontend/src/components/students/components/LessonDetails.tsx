import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface Lesson {
  title: string;
  introduction: string;
  videoLink?: string;
  flashcardRoute?: string;
  guidedPractice?: string;
  quiz?: string[];
  simulationRoute?: string;
  otherReferences?: string;
}

const LessonDetail: React.FC = () => {
  const location = useLocation();
  const { lessonData }: { lessonData: Lesson } = location.state || {};

  // Log to check if lessonData is passed correctly
  console.log("Lesson data received:", lessonData);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const title = lessonData?.title || '';

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        console.log("Fetching lesson for title:", title); // Log title being fetched
        
        const token = localStorage.getItem("token");
        console.log("Authorization token:", token); // Log token
        
        // Updated fetch URL to match the backend route
        const response = await fetch(`http://localhost:4000/api/lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error("Failed to fetch lesson data:", response.statusText);
          throw new Error("Failed to fetch lesson data");
        }

        const data = await response.json();
        console.log("Fetched lesson data:", data);  // Log the fetched data

        setLesson(data);  // Set lesson data

      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    if (title) {
      fetchLesson();
    }
  }, [title]);

  if (!lesson) {
    return <div>Loading lesson...</div>;
  }

  const sections = [
    "introduction",
    "video",
    "flashcards",
    "guidedPractice",
    "quiz",
    "simulation",
    "otherReferences",
  ];

  const sectionContent: { [key: string]: JSX.Element } = {
    introduction: <div dangerouslySetInnerHTML={{ __html: lesson.introduction }} />,
    video: lesson.videoLink ? (
      <div>
        <h3>Lesson Video</h3>
        <iframe width="560" height="315" src={lesson.videoLink} title="Lesson Video" frameBorder="0" allowFullScreen></iframe>
      </div>
    ) : (
      <p>No video available</p>
    ),
    flashcards: lesson.flashcardRoute ? (
      <div>
        <h3>Flashcards</h3>
        <a href={lesson.flashcardRoute} target="_blank" rel="noopener noreferrer">View Flashcards</a>
      </div>
    ) : (
      <p>No flashcards available</p>
    ),
    guidedPractice: <p>{lesson.guidedPractice || "No guided practice available"}</p>,
    quiz: lesson.quiz?.length ? (
      <ul>
        {lesson.quiz.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    ) : (
      <p>No quiz available</p>
    ),
    simulation: lesson.simulationRoute ? (
      <a href={lesson.simulationRoute} target="_blank" rel="noopener noreferrer">Start Simulation</a>
    ) : (
      <p>No simulation available</p>
    ),
    otherReferences: lesson.otherReferences ? (
      <a href={lesson.otherReferences} target="_blank" rel="noopener noreferrer">View References</a>
    ) : (
      <p>No additional references</p>
    ),
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", padding: "10px", borderRight: "1px solid #ccc" }}>
        <h2>{lesson.title}</h2>
        <ul>
          {sections.map((section) => (
            <li
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                cursor: "pointer",
                fontWeight: activeSection === section ? "bold" : "normal",
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      {/* Lesson Content */}
      <div style={{ padding: "10px", flex: 1 }}>
        <h2>{lesson.title}</h2>
        {sectionContent[activeSection]}
      </div>
    </div>
  );
};

export default LessonDetail;
