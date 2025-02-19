// MathLessons.tsx
import React, { useState } from 'react';
import { lessonsData } from './data/MathLessonsData'; // Import lessonsData from the separate file
import "./css/index.css";
import NavBar from './NavBar';
import Footer from './Footer';

const MathLessons: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<keyof typeof lessonsData>('numbers');
  const [glowStates, setGlowStates] = useState<boolean[]>(
    new Array(lessonsData[selectedTopic].flashCards.length).fill(false)
  );

  const lesson = lessonsData[selectedTopic];

  // Define a color palette
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFF5'];

  const handleCardClick = (index: number) => {
    setGlowStates((prev) =>
      prev.map((glow, i) => (i === index ? !glow : glow))
    );
  };

  return (
    <>
      <NavBar />
      <div className="lessons-page">
        <div className="sidebarContent">
          <div className="sidebar">
            <h1>Topics</h1>
            <ul>
              {Object.keys(lessonsData).map((topic) => (
                <li
                  key={topic}
                  className={selectedTopic === topic ? 'active' : ''}
                  onClick={() => {
                    setSelectedTopic(topic as keyof typeof lessonsData);
                    setGlowStates(
                      new Array(lessonsData[topic as keyof typeof lessonsData].flashCards.length).fill(false)
                    );
                  }}
                >
                  {topic.replace(/([A-Z])/g, ' $1')}
                </li>
              ))}
            </ul>
          </div>
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
          </div>
        </div>
        <div className="visuals">
          <section className="flash-cards">
            <h2>Flash Cards</h2>
            <ul>
              {lesson.flashCards.map((card, index) => (
                <li
                  key={index}
                  className={glowStates[index] ? 'glow' : ''}
                  onClick={() => handleCardClick(index)}
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  <img src={card.img} alt={card.word} />
                  <p>{card.word}</p>
                </li>
              ))}
            </ul>
          </section>
          <hr />
          <section className="video">
            <h2>Video</h2>
            <iframe
              width="490"
              height="275"
              src={lesson.video}
              allowFullScreen
            ></iframe>
          </section>
        </div>
      </div>
      <section className="links">
        <button onClick={() => (window.location.href = lesson.quizLink)}>Take the Quiz</button>
        <button onClick={() => (window.location.href = lesson.gameLink)}>Play the Game</button>
      </section>
      <Footer />
    </>
  );
};

export default MathLessons;
