
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const PathwaySteps: React.FC = () => {
//   const { pathwayId } = useParams<{ pathwayId: string }>();
//   const [pathway, setPathway] = useState<any | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
//   const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
//   const [nextPathwayId, setNextPathwayId] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!pathwayId) {
//       setError("Pathway ID is missing.");
//       setLoading(false);
//       return;
//     }

//     const fetchPathway = async () => {
//       try {
//         const formattedPathwayId = pathwayId.charAt(0).toUpperCase() + pathwayId.slice(1);
//         console.log("Fetching pathway with ID:", formattedPathwayId);
    
//         // Fetch the current pathway by title
//         const response = await fetch(`http://localhost:4000/api/pathways/subject/${formattedPathwayId}`);
//         console.log("Response status:", response.status);
    
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(`Server Error: ${response.status} - ${errorData.message}`);
//         }
    
//         const data = await response.json();
//         console.log("Fetched Pathway Data:", data);
//         setPathway(data);
    
//         // Fetch the next pathway within the same subject
//         if (data?.subject && data?.title) {
//           const nextResponse = await fetch(
//             `http://localhost:4000/api/pathways/next/subject/${data.subject}/title/${data.title}`
//           );
//           const nextData = await nextResponse.json();
    
//           if (nextResponse.ok && nextData?.title) {
//             setNextPathwayId(nextData.title);
//           } else {
//             console.log("No next lesson found in this subject.");
//             setNextPathwayId(null); // Reset nextPathwayId
//           }
//         }
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPathway();
//   }, [pathwayId]);
  

//   const nextSection = () => {
//     setCompletedSections((prev) => new Set(prev.add(currentSectionIndex)));
  
//     if (currentSectionIndex < sections.length - 1) {
//       setCurrentSectionIndex(currentSectionIndex + 1);
//     } else {
//       const nextTitle = sections[currentSectionIndex].title;
  
//       if (nextTitle === "Quiz" || nextTitle === "References") {
//         console.log("Final section reached, navigating to next lesson...");
//         if (nextPathwayId) {
//           console.log(`Navigating to: /pathway/${nextPathwayId}`);
//           navigate(`/pathway/${encodeURIComponent(nextPathwayId)}`);
//         } else {
//           console.log("No next lesson available.");
//         }
//       }
//     }
//   };
  
  

//   if (loading) return <p>Loading pathway...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!pathway) return <p>No pathway data available.</p>;

//   const sections = [
//     { title: "Introduction", content: pathway.sections.introduction },
//     { title: "Metaphor", content: pathway.sections.metaphor },
//     { title: "Lesson Explanation", content: pathway.sections.lessonExplanation },
//     { title: "Simulation", content: pathway.sections.simulation },
//     { title: "Video", content: pathway.sections.video },
//     { title: "Quiz", content: pathway.sections.quiz },
//     { title: "References", content: pathway.sections.references }
//   ];

//   return (
//     <div className="pathway-container">
//       <h1>{pathway.title}</h1>
//       <h2>Subject: {pathway.subject}</h2>

//       <h3>{sections[currentSectionIndex].title}</h3>
//       <div>
//   {sections[currentSectionIndex].title === "Quiz" ? (
//     <ul>
//       {sections[currentSectionIndex].content.map((quizItem: any, index: number) => (
//         <li key={quizItem._id}>
//           <p><strong>Question {index + 1}:</strong> {quizItem.question}</p>
//           <form>
//             {quizItem.options.map((option: string, i: number) => (
//               <label key={i} style={{ display: "block", marginBottom: "5px" }}>
//                 <input type="radio" name={`quiz-${index}`} value={option} />{" "}
//                 {String.fromCharCode(65 + i)}. {option}
//               </label>
//             ))}
//           </form>
//         </li>
//       ))}
//     </ul>
//   ) : sections[currentSectionIndex].title === "Video" ? (
//     sections[currentSectionIndex].content.includes("youtube.com") ? (
//       <iframe
//         width="100%"
//         height="400"
//         src={sections[currentSectionIndex].content.replace("watch?v=", "embed/")}
//         title="Lesson Video"
//         frameBorder="0"
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//       ></iframe>
//     ) : (
//       <a href={sections[currentSectionIndex].content} target="_blank" rel="noopener noreferrer">
//         Watch Video
//       </a>
//     )
//   ) : (
//     <p>{sections[currentSectionIndex].content}</p>
//   )}
// </div>


//       <button onClick={nextSection}>
//         {currentSectionIndex < sections.length - 1 ? "Next Section" : "Next Lesson"}
//       </button>
//     </div>
//   );
// };

// export default PathwaySteps;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Type definition for a QuizQuestion
type QuizQuestion = {
  question: string;
  options: string[];
};

const PathwaySteps: React.FC = () => {
  const { pathwayId } = useParams<{ pathwayId: string }>();
  const [pathway, setPathway] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [nextPathwayId, setNextPathwayId] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pathwayId) {
      setError("Pathway ID is missing.");
      setLoading(false);
      return;
    }

    const fetchPathway = async () => {
      try {
        const formattedPathwayId = pathwayId.charAt(0).toUpperCase() + pathwayId.slice(1);
        console.log("Fetching pathway with ID:", formattedPathwayId);
    
        // Fetch the current pathway by title
        const response = await fetch(`http://localhost:4000/api/pathways/subject/${formattedPathwayId}`);
        console.log("Response status:", response.status);
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Server Error: ${response.status} - ${errorData.message}`);
        }
    
        const data = await response.json();
        console.log("Fetched Pathway Data:", data);
        setPathway(data);
    
        // Fetch the next pathway within the same subject
        if (data?.subject && data?.title) {
          const nextResponse = await fetch(
            `http://localhost:4000/api/pathways/next/subject/${data.subject}/title/${data.title}`
          );
          const nextData = await nextResponse.json();
    
          if (nextResponse.ok && nextData?.title) {
            setNextPathwayId(nextData.title);
          } else {
            console.log("No next lesson found in this subject.");
            setNextPathwayId(null); // Reset nextPathwayId
          }
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchPathway();
  }, [pathwayId]);

  const nextSection = () => {
    setCompletedSections((prev) => new Set(prev.add(currentSectionIndex)));
  
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      const nextTitle = sections[currentSectionIndex].title;
  
      if (nextTitle === "Quiz" || nextTitle === "References") {
        console.log("Final section reached, navigating to next lesson...");
        if (nextPathwayId) {
          console.log(`Navigating to: /pathway/${nextPathwayId}`);
          navigate(`/pathway/${encodeURIComponent(nextPathwayId)}`);
        } else {
          console.log("No next lesson available.");
        }
      }
    }
  };

  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { question: "", options: ["", "", "", ""] }
    ]);
  };

  const handleQuizChange = (index: number, field: "question" | "options", value: string, optionIndex?: number) => {
    const updatedQuestions = [...quizQuestions];
    
    if (field === "question") {
      updatedQuestions[index].question = value;
    } else if (field === "options" && optionIndex !== undefined) {
      const updatedOptions = [...updatedQuestions[index].options];
      updatedOptions[optionIndex] = value;
      updatedQuestions[index].options = updatedOptions;
    }
    
    setQuizQuestions(updatedQuestions);
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
    { title: "References", content: pathway.sections.references }
  ];

  return (
    <div className="pathway-container">
      <h1>{pathway.title}</h1>
      <h2>Subject: {pathway.subject}</h2>

      <h3>{sections[currentSectionIndex].title}</h3>
      <div>
        {sections[currentSectionIndex].title === "Quiz" ? (
          <>
            <ul>
              {quizQuestions.map((quizItem, index) => (
                <li key={index}>
                  <p><strong>Question {index + 1}:</strong></p>
                  <input
                    type="text"
                    placeholder="Enter Question"
                    value={quizItem.question}
                    onChange={(e) => handleQuizChange(index, "question", e.target.value)}
                  />
                  {quizItem.options.map((option, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={option}
                      onChange={(e) => handleQuizChange(index, "options", e.target.value, i)} // Now `option` is always a string
                    />
                  ))}
                </li>
              ))}
            </ul>
            <button onClick={addQuizQuestion}>Add Question</button>
          </>
        ) : sections[currentSectionIndex].title === "Video" ? (
          sections[currentSectionIndex].content.includes("youtube.com") ? (
            <iframe
              width="100%"
              height="400"
              src={sections[currentSectionIndex].content.replace("watch?v=", "embed/")}
              title="Lesson Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video controls width="100%">
              <source src={sections[currentSectionIndex].content} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        ) : (
          <p>{sections[currentSectionIndex].content}</p>
        )}
      </div>

      <button onClick={nextSection}>
        {currentSectionIndex < sections.length - 1 ? "Next Section" : "Next Lesson"}
      </button>
    </div>
  );
};

export default PathwaySteps;
