import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../css/Pathway.css"; 

interface Lesson {
  _id: { $oid: string };
  topic: string;
  subject: string;
  lessonNumber: string;
  points: number;
}

const Pathway: React.FC = () => {
  const navigate = useNavigate();
  const [mathLessons, setMathLessons] = useState<Lesson[]>([]);
  const [scienceLessons, setScienceLessons] = useState<Lesson[]>([]);
  const [showMathLessons, setShowMathLessons] = useState(false);
  const [showScienceLessons, setShowScienceLessons] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:4000/api/pathways')
      .then((response) => {
        const lessons: Lesson[] = response.data;
        setMathLessons(lessons.filter((lesson) => lesson.subject === 'math'));
        setScienceLessons(lessons.filter((lesson) => lesson.subject === 'science'));
      })
      .catch((error) => console.error('Error fetching lessons:', error));
  }, []);

  const handleMathPathwayClick = () => {
    setShowMathLessons(true);
    setShowScienceLessons(false);
  };

  const handleSciencePathwayClick = () => {
    setShowScienceLessons(true);
    setShowMathLessons(false);
  };

  const startLesson = (subject: string, lessonNumber: string) => {
    navigate(`/pathway/${subject}/lesson/${lessonNumber}`);
  };

  return (
    <div className="pathway-selection">
      <h1>Learning Pathways</h1>

      <div className="pathway-buttons">
        <button className="math-pathway-button" onClick={handleMathPathwayClick}>
          📘 Show Math Pathway
        </button>
        <button className="science-pathway-button" onClick={handleSciencePathwayClick}>
          🔬 Show Science Pathway
        </button>
      </div>

      {showMathLessons && (
        <>
          <h2>📘 Math Lessons</h2>
          <div className="lesson-grid">
            {mathLessons.map((lesson) => (
              <button
                key={lesson._id.$oid}
                className="lesson-button math-lesson"
                onClick={() => startLesson('math', lesson.lessonNumber)}
              >
                {lesson.topic} (Lesson {lesson.lessonNumber})
              </button>
            ))}
          </div>
        </>
      )}

      {showScienceLessons && (
        <>
          <h2>🔬 Science Lessons</h2>
          <div className="lesson-grid">
            {scienceLessons.map((lesson) => (
              <button
                key={lesson._id.$oid}
                className="lesson-button science-lesson"
                onClick={() => startLesson('science', lesson.lessonNumber)}
              >
                {lesson.topic} (Lesson {lesson.lessonNumber})
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Pathway;
