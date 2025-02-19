import { useState, useEffect } from "react";
import axios from "axios";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type Pathway = {
  _id: string;
  title: string;
  subject: string;
  sections: {
    introduction: string;
    metaphor: string;
    lessonExplanation: string;
    video: string;
    guidedPractice: string;
    quiz: QuizQuestion[];
    simulation: string;
    references: string[];
  };
};

const MathPathway = () => {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchPathways();
  }, []);

  const fetchPathways = async () => {
    const res = await axios.get<Pathway[]>("http://localhost:4000/api/pathways");
    setPathways(res.data);
  };

  const handleQuizAnswer = (index: number, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>

      {/* List of Pathways */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {pathways.map((pathway) => (
          <div key={pathway._id} className="p-4 border rounded shadow-md">
            <h2 className="text-lg font-bold">{pathway.title}</h2>
            <p className="text-sm">{pathway.subject}</p>
            <button onClick={() => setSelectedPathway(pathway)} className="bg-blue-500 text-white px-3 py-1 rounded mt-2">
              View Pathway
            </button>
          </div>
        ))}
      </div>

      {/* Pathway Details Modal */}
      {selectedPathway && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-5">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold">{selectedPathway.title}</h2>
            <p><strong>Subject:</strong> {selectedPathway.subject}</p>
            <p><strong>Introduction:</strong> {selectedPathway.sections.introduction}</p>
            <p><strong>Metaphor:</strong> {selectedPathway.sections.metaphor}</p>
            <p><strong>Lesson Explanation:</strong> {selectedPathway.sections.lessonExplanation}</p>

            {/* Video */}
            {selectedPathway.sections.video && (
              <div className="mt-4">
                <h3 className="font-bold">Video</h3>
                <iframe
                  width="100%"
                  height="315"
                  src={selectedPathway.sections.video}
                  title="Lesson Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <p><strong>Guided Practice:</strong> {selectedPathway.sections.guidedPractice}</p>

            {/* Simulation */}
            {selectedPathway.sections.simulation && (
              <p><strong>Simulation:</strong> {selectedPathway.sections.simulation}</p>
            )}

            {/* References */}
            <h3 className="font-bold mt-4">References</h3>
            <ul>
              {selectedPathway.sections.references.map((ref, idx) => (
                <li key={idx} className="text-blue-600 underline">{ref}</li>
              ))}
            </ul>

            {/* Quiz Section */}
            <h3 className="font-bold mt-4">Quiz</h3>
            {selectedPathway.sections.quiz.map((q, index) => (
              <div key={index} className="p-3 border rounded mt-2">
                <p className="font-bold">{q.question}</p>
                {q.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <input
                      type="radio"
                      name={`quiz-${index}`}
                      value={option}
                      checked={quizAnswers[index] === option}
                      onChange={() => handleQuizAnswer(index, option)}
                      className="mr-2"
                    />
                    {option}
                  </div>
                ))}
              </div>
            ))}

            <button onClick={() => setSelectedPathway(null)} className="mt-5 bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathPathway;
