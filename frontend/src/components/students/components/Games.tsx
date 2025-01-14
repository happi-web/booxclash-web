import { useState, useEffect } from 'react';

const Games = () => {
  const [games, setGames] = useState<any[]>([]); // State to store fetched games
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch games data when the component mounts
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/content/game'); // Endpoint for games
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data); // Store games in state
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching games:', error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div>Loading games...</div>;
  }

  return (
    <div>
      <h2>Games</h2>
      {games.length === 0 ? (
        <p>No games available.</p>
      ) : (
        <div className="games-list">
          {games.map((game: any) => (
            <div key={game._id} className="game-card">
              <img
                src={`http://localhost:4000${game.thumbnail}`}
                alt={game.title}
                className="game-thumbnail"
              />
              <h3>{game.title}</h3>
              <button
                onClick={() => {
                  window.open(game.component, '_blank');
                }}
              >
                Play Game
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Games;
