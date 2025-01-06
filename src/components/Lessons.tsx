import React, { useState } from 'react';
import "./css/lessons.css";
import NavBar from './NavBar';
import Footer from './Footer';

const lessonsData = {
  fiveSenses: {
    intro: "We use our five senses to explore the world around us. They help us see, hear, smell, taste, and feel.",
    explanation: `Our five senses are sight, hearing, touch, taste, and smell. 
    Each sense helps us in different ways:
    - Sight: Our eyes help us see.
    - Hearing: Our ears help us hear sounds.
    - Touch: Our skin helps us feel.
    - Taste: Our tongue helps us taste.
    - Smell: Our nose helps us smell.`,
    flashCards: ["Eyes (Sight)", "Ears (Hearing)", "Skin (Touch)", "Tongue (Taste)", "Nose (Smell)"],
    video: "https://www.youtube.com/embed/q1xNuU7gaAQ",
    quizLink: "/quizPage",
    gameLink: "/gameRoom"
  },
  humanBody: {
    intro: "The human body is an amazing system that keeps us alive.",
    explanation: `The body has different systems like the digestive, circulatory, and nervous systems. 
    Each system works together to help us survive.`,
    flashCards: ["Heart", "Lungs", "Brain", "Stomach", "Bones"],
    video: "https://youtu.be/q1xNuU7gaAQ?si=swwgloF95TGd4zQ0", // Example YouTube link
    quizLink: "/quizPage",
    gameLink: "/gameRoom"
  }
};

const Lessons: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<keyof typeof lessonsData>('fiveSenses');

  const lesson = lessonsData[selectedTopic];

  // Ensure the video URL exists before attempting to split
  let embedUrl = "";
  if (lesson.video) {
    // Check if it's a direct embed URL or a regular YouTube link
    if (lesson.video.includes("youtu.be")) {
      const videoId = lesson.video.split('v=')[1]?.split('?')[0];
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else {
      embedUrl = lesson.video; // Direct embed URL
    }
  }

  return (
    <div className="container-content">
           <>
      <NavBar />
      <div className="lessons-page">
        {/* Sidebar for topics */}
        <div className="sidebar">
          <h3>Topics</h3>
          <ul>
            {Object.keys(lessonsData).map(topic => (
              <li
                key={topic}
                className={selectedTopic === topic ? 'active' : ''}
                onClick={() => setSelectedTopic(topic as keyof typeof lessonsData)}
              >
                {topic.replace(/([A-Z])/g, ' $1')}
              </li>
            ))}
          </ul>
        </div>

        {/* Main content area */}
        <div className="content">
          <h1>{selectedTopic.replace(/([A-Z])/g, ' $1')}</h1>
          <section>
            <h2>Introduction</h2>
            <p>{lesson.intro}</p>
          </section>
          <section>
            <h2>Explanation</h2>
            <p>{lesson.explanation}</p>
          </section>
          <section>
            <h2>Flash Cards</h2>
            <ul>
              {lesson.flashCards.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Video</h2>
            {embedUrl && (
              <iframe
                width="560"
                height="315"
                src={embedUrl}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
            {!embedUrl && <p>Video not available.</p>}
          </section>
          <section className="links">
            <button onClick={() => (window.location.href = lesson.quizLink)}>Take the Quiz</button>
            <button onClick={() => (window.location.href = lesson.gameLink)}>Play the Game</button>
          </section>
        </div>
      </div>
      <Footer />
    </> 
    </div>

  );
};

export default Lessons;
