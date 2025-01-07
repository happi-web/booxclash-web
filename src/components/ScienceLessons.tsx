import React, { useState } from 'react';
import "./css/lessons.css";
import NavBar from './NavBar';
import Footer from './Footer';

const lessonsData = {
  fiveSenses: {
    intro: "We use our five senses to explore the world around us. They help us see, hear, smell, taste, and feel.",
    explanation: `Our five senses are sight, hearing, touch, taste, and smell. 
    Each sense helps us in different ways:`,
    list:`
    - Sight: Our eyes help us see.,
    - Hearing: Our ears help us hear sounds.
    - Touch: Our skin helps us feel.
    - Taste: Our tongue helps us taste.
    - Smell: Our nose helps us smell.`,
    flashCards: [
      { word: "Eye", img: "/booxclash-web/images/connect.jpg" },
      { word: "Nose", img: "/booxclash-web/images/logo.png" },
      { word: "Mouth", img: "/booxclash-web/images/logo.png" },
      { word: "Hands", img: "/booxclash-web/images/logo.png" },
      { word: "Tongue", img: "/booxclash-web/images/logo.png" },
    ],
    video: "https://www.youtube.com/embed/q1xNuU7gaAQ",
    quizLink: "/quizPage",
    gameLink: "/gameRoom",
  },
  humanBody: {
    intro: "The human body is an amazing system that keeps us alive.",
    explanation: `The body has different systems like the digestive, circulatory, and nervous systems. 
    Each system works together to help us survive.`,
    list:``,
    flashCards: [
      { word: "Heart", img: "/booxclash-web/images/connect.jpg" },
      { word: "Lungs", img: "/booxclash-web/images/logo.png" },
      { word: "Brain", img: "/booxclash-web/images/logo.png" },
      { word: "Stomach", img: "/booxclash-web/images/logo.png" },
      { word: "Bones", img: "/booxclash-web/images/logo.png" },
    ],
    video: "https://www.youtube.com/embed/q1xNuU7gaAQ",
    quizLink: "/quizPage",
    gameLink: "/gameRoom",
  },
};

const ScienceLessons: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<keyof typeof lessonsData>('fiveSenses');
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
                  style={{ backgroundColor: colors[index % colors.length] }} // Assign unique color
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

export default ScienceLessons;
