import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PathwaySteps: React.FC = () => {
  const { subject, lessonNumber } = useParams<{ subject: string; lessonNumber: string }>();
  const [pathway, setPathway] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<any>([]); // Store user's quiz answers
  const [quizResults, setQuizResults] = useState<any>(null); // Store quiz results (correct and incorrect)
  const [nextPathwayId, setNextPathwayId] = useState<string | null>(null); // Fix missing state definition
  const navigate = useNavigate();

  useEffect(() => {
    if (!subject || !lessonNumber) {
      setError("Subject or lesson number is missing.");
      setLoading(false);
      return;
    }

    const fetchPathway = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/pathways/subject/${subject}/lesson/${lessonNumber}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Server Error: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        setPathway(data);

        // Fetch next pathway information
        const nextResponse = await fetch(
          `http://localhost:4000/api/pathways/next/subject/${data.subject}/lesson/${data.lessonNumber}`
        );
        const nextData = await nextResponse.json();

        if (nextResponse.ok && nextData?.lessonNumber) {
          setNextPathwayId(nextData.lessonNumber);
        } else {
          setNextPathwayId(null);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPathway();
  }, [subject, lessonNumber]);

  const getEmbeddedYouTubeUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1] || "";
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const handleQuizAnswer = (quizIndex: number, selectedAnswer: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[quizIndex] = selectedAnswer;
    setQuizAnswers(newAnswers);
  };

  const nextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      setLessonCompleted(true);
      calculateQuizResults(); // Calculate quiz results when the lesson is finished
    }
  };

  const calculateQuizResults = () => {
    const correctAnswers: boolean[] = pathway.sections.quiz.map((item: any, index: number) => {
      return quizAnswers[index] === item.correctAnswer;
    });

    const correctCount = correctAnswers.filter((isCorrect) => isCorrect).length;
    const incorrectCount = correctAnswers.length - correctCount;

    setQuizResults({ correctCount, incorrectCount, correctAnswers });
    setPoints(correctCount * 10); // Award 10 points for each correct answer
  };

  if (loading) return <p>Loading pathway...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pathway) return <p>No pathway data available.</p>;

  const sections = [
    { title: "Introduction", content: pathway.sections.introduction },
    { title: "Metaphor", content: pathway.sections.metaphor },
    { title: "Lesson Explanation", content: pathway.sections.lessonExplanation },
    { title: "Simulation", content: pathway.sections.simulation },
    { title: "Video", content: pathway.sections.video },
    { title: "Quiz", content: pathway.sections.quiz },
    { title: "References", content: pathway.sections.references },
  ];

  if (lessonCompleted) {
    return (
      <div className="congratulations-container">
        <h1>Congratulations!</h1>
        <p>You have completed the lesson: {pathway.topic}</p>
        <p>Total Points Earned: {points}</p>
        <p>
          You got {quizResults?.correctCount} correct and {quizResults?.incorrectCount} incorrect answers.
        </p>
        <h3>Correct Answers:</h3>
        <ul>
          {pathway.sections.quiz.map((quizItem: any, index: number) => (
            <li key={quizItem._id}>
              <strong>Question {index + 1}: </strong>
              {quizItem.question} <br />
              <strong>Correct Answer:</strong> {quizItem.correctAnswer}
            </li>
          ))}
        </ul>
        {nextPathwayId ? (
          <button onClick={() => navigate(`/pathway/${subject}/lesson/${nextPathwayId}`)}>
            Start Next Lesson
          </button>
        ) : (
          <p>No more lessons available.</p>
        )}
      </div>
    );
  }

  return (
    <div className="pathway-container">
      <h1>Pathway: {pathway.subject}</h1>
      <h2>{pathway.topic}</h2>
      <h3>{sections[currentSectionIndex].title}</h3>
      <div>
        {sections[currentSectionIndex].title === "Quiz" ? (
          <ul>
            {sections[currentSectionIndex].content.map((quizItem: any, index: number) => (
              <li key={quizItem._id}>
                <p><strong>Question {index + 1}:</strong> {quizItem.question}</p>
                <form>
                  {quizItem.options.map((option: string, i: number) => (
                    <label key={i} style={{ display: "block", marginBottom: "5px" }}>
                      <input
                        type="radio"
                        name={`quiz-${index}`}
                        value={option}
                        onChange={() => handleQuizAnswer(index, option)}
                      />{" "}
                      {String.fromCharCode(65 + i)}. {option}
                    </label>
                  ))}
                </form>
              </li>
            ))}
          </ul>
        ) : sections[currentSectionIndex].title === "Video" ? (
          sections[currentSectionIndex].content ? (
            <iframe
              width="100%"
              height="400"
              src={getEmbeddedYouTubeUrl(sections[currentSectionIndex].content)}
              title="Lesson Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <p>No video available.</p>
          )
        ) : (
          <p>{sections[currentSectionIndex].content}</p>
        )}
      </div>

      <button
        onClick={nextSection}
        disabled={sections[currentSectionIndex].title === "Quiz" && quizAnswers.length !== sections[currentSectionIndex].content.length}
      >
        {currentSectionIndex < sections.length - 1 ? "Next Section" : "Finish Lesson"}
      </button>
    </div>
  );
};

export default PathwaySteps;
