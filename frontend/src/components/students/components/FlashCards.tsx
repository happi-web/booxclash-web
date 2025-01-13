import { useState, useEffect } from 'react';

const FlashCards = () => {
  const [flashcards, setFlashcards] = useState<any[]>([]); // State to store fetched flashcards
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/content/flashcard'); // Fetching flashcards data
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards');
        }
        const data = await response.json();
        setFlashcards(data); // Store flashcards in state
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  if (loading) {
    return <div>Loading flashcards...</div>;
  }

  return (
    <div>
      <h2>Flashcards</h2>
      {flashcards.length === 0 ? (
        <p>No flashcards available.</p>
      ) : (
        <div className="flashcards-list">
          {flashcards.map((flashcard: any) => (
            <div key={flashcard._id} className="flashcard-card">
              <img
                src={`http://localhost:4000${flashcard.thumbnail}`} // Adjust the path if necessary
                alt={flashcard.title}
                className="flashcard-thumbnail"
              />
              <h3>{flashcard.title}</h3>
              <button
                onClick={() => {
                  window.open(flashcard.videoLink, '_blank'); // Play flashcard content if applicable
                }}
              >
                View Flashcard
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashCards;
