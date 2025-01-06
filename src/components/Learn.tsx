import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

function Learn() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const navigate = useNavigate();

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
        {selectedGrade && (
          <div className="subjects-menu">
            <h2>Grade {selectedGrade} Subjects</h2>
            {(["Science", "Math"] as const).map((subject) => (
              <button
                key={subject}
                onClick={() => {
                  if (subject === "Science") {
                    navigate("/scienceLessons", { state: { grade: selectedGrade } });
                  } else if (subject === "Math") {
                    navigate("/mathLessons", { state: { grade: selectedGrade } });
                  }
                }}
                className="subject-button"
              >
                {subject}
              </button>
            ))}
            <button onClick={() => setSelectedGrade(null)} className="back-button">
              Back to Grades
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Learn;
