import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Footer from "./Footer";
import NavBar from "./NavBar";

function Learn() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<"Science" | "Math" | null>(null);
  const navigate = useNavigate(); // Initialize navigate

  type LessonData = {
    [key: number]: {
      Science: { title: string; image: string; explanation: string; video: string }[];
      Math: { title: string; image: string; explanation: string; video: string }[];
    };
  };

  const lessons: LessonData = {
    1: {
      Science: [
        {
          title: "The Five Senses",
          image: "./images/five-senses.jpg",
          explanation: "Learn about the five senses and how they help us understand the world.",
          video: "https://www.youtube.com/embed/example1",
        },
        {
          title: "Living and Non-Living Things",
          image: "./images/living-things.jpg",
          explanation: "Understand the difference between living and non-living things.",
          video: "https://www.youtube.com/embed/example2",
        },
      ],
      Math: [
        {
          title: "Counting Numbers",
          image: "./images/counting.jpg",
          explanation: "Learn how to count numbers effectively.",
          video: "https://www.youtube.com/embed/example3",
        },
        {
          title: "Basic Shapes",
          image: "./images/shapes.jpg",
          explanation: "Discover basic shapes and their properties.",
          video: "https://www.youtube.com/embed/example4",
        },
      ],
    },
    // Add more grades and subjects...
  };

  return (
    <div>
      <NavBar />

      <div className="play-container">
        {/* Grades Menu */}
        {!selectedGrade && (
          <div className="grades-menu">
            <h2>Select a Grade</h2>
            {[1, 2, 3, 4, 5, 6].map((grade) => (
              <button key={grade} onClick={() => setSelectedGrade(grade)} className="grade-button">
                Grade {grade}
              </button>
            ))}
          </div>
        )}

        {/* Subjects Menu */}
        {selectedGrade && !selectedSubject && (
          <div className="subjects-menu">
            <h2>Grade {selectedGrade} Subjects</h2>
            {(["Science", "Math"] as const).map((subject) => (
              <button key={subject} onClick={() => setSelectedSubject(subject)} className="subject-button">
                {subject}
              </button>
            ))}
            <button onClick={() => setSelectedGrade(null)} className="back-button">
              Back to Grades
            </button>
          </div>
        )}

        {/* Lesson Cards */}
        {selectedGrade && selectedSubject && (
          <div className="lessons-container">
            <h2>Grade {selectedGrade} - {selectedSubject} Lessons</h2>
            <div className="lesson-cards">
              {lessons[selectedGrade][selectedSubject].map((lesson, index) => (
                <div
                  key={index}
                  className="lesson-card"
                  style={{ backgroundImage: `url(${lesson.image})` }}
                  onClick={() =>
                    navigate("/lessons", {
                      state: { lesson, grade: selectedGrade, subject: selectedSubject },
                    })
                  }
                >
                  <h3>{lesson.title}</h3>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedSubject(null)} className="back-button">
              Back to Subjects
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Learn;
