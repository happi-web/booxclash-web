import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useSound from "use-sound";
import correctSfx from "../sounds/correct.mp3";
import clickSfx from "../sounds/click.mp3";
import NavBar from "../../NavBar";

interface Lesson {
  _id: string;
  title: string;
  introduction: string;
  videoLink: string;
  flashcardRoute: string;
  guidedPractice: string;
  quiz: { question: string; options: string[]; answer: string }[];
  simulationRoute: string;
  otherReferences: string;
  pathway: string;
  level: number;
}

export default function Lessons() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [playClick] = useSound(clickSfx);
  const [playCorrect] = useSound(correctSfx);

  // Fetch lesson from backend
  useEffect(() => {
    fetch("http://localhost:4000/api/lessons", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored properly
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setLesson(data[0]))
      .catch((error) => console.error("Error fetching lesson:", error));
  }, []);
  

  if (!lesson) return <p>Loading lesson...</p>;

  const steps = [
    { type: "intro", content: lesson.introduction },
    { type: "video", url: lesson.videoLink },
    { type: "quiz", data: lesson.quiz },
    { type: "simulation", url: lesson.simulationRoute },
  ];

  const handleNextStep = () => {
    playClick();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="outer-interface">
      <NavBar />
      <div className="inner-interface">
        <motion.div
          className="p-6 bg-gray-100 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold">{lesson.title}</h2>

          <motion.div
            className="my-4 p-4 bg-white shadow-md rounded-lg"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {steps[currentStep].type === "intro" && <p>{steps[currentStep].content}</p>}

            {steps[currentStep].type === "video" && (
              <iframe
                className="w-full h-60"
                src={steps[currentStep].url}
                title="Lesson Video"
                allowFullScreen
              />
            )}

            {steps[currentStep].type === "quiz" &&
              steps[currentStep].data &&
              steps[currentStep].data.map((q, index) => (
                <div key={index}>
                  <p>{q.question}</p>
                  {q.options.map((option, i) => (
                    <button
                      key={i}
                      className="block my-2 p-2 bg-green-300 rounded-md"
                      onClick={() => playCorrect()}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ))}

            {steps[currentStep].type === "simulation" && (
              <a href={steps[currentStep].url} className="text-blue-500 underline">
                Start Simulation
              </a>
            )}
          </motion.div>

          <motion.button
            onClick={handleNextStep}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Next
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
