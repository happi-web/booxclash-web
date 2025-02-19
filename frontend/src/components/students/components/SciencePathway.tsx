import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Pathway.css"; // Import styles

const SciencePathway: React.FC = () => {
  const navigate = useNavigate();
  const [unlockedLessons, setUnlockedLessons] = useState<number>(1);

  const topics = [
    {
      level: 1,
      title: "Introduction to Science",
      topics: [
        {
          name: "Core Science Lessons",
          lessons: [
            { id: 1, title: "Scientific Method", unlocked: true },
            { id: 2, title: "Basic Chemistry", unlocked: false },
            { id: 3, title: "Energy & Forces", unlocked: false },
          ],
        },
      ],
    },
  ];

  const handleStartLesson = (lessonId: number) => {
    if (lessonId <= unlockedLessons) {
      navigate(`/lessons/${lessonId}`);
      setUnlockedLessons(lessonId + 1);
    }
  };

  return (
    <div className="pathway-container">
      <h1>Science Learning Pathway</h1>
      <div className="lessons-grid">
        {topics[0].topics[0].lessons.map((lesson) => (
          <button
            key={lesson.id}
            className={`lesson-card ${lesson.id <= unlockedLessons ? "unlocked" : "locked"}`}
            onClick={() => handleStartLesson(lesson.id)}
            disabled={lesson.id > unlockedLessons}
          >
            {lesson.id <= unlockedLessons ? lesson.title : "🔒 Locked"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SciencePathway;
