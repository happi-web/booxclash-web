import { useState, useEffect } from 'react';
import "../../css/index.css";

const Games = () => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGame, setSelectedGame] = useState<string | null>(null); // Track selected game

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/content/game');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data);
        setLoading(false);
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
      {/* If a game is selected, show it inside an iframe */}
      {selectedGame ? (
        <div>
          <button onClick={() => setSelectedGame(null)}>Back to Games</button>
          <iframe
            src={selectedGame}
            title="Game"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          ></iframe>
        </div>
      ) : (
        <div className="games-list">
          {games.length === 0 ? (
            <p>No games available.</p>
          ) : (
            games.map((game: any) => (
              <div key={game._id} className="game-card">
                <img
                  src={`http://localhost:4000${game.thumbnail}`}
                  alt={game.title}
                  className="game-thumbnail"
                />
                <h3>{game.title}</h3>
                <button onClick={() => setSelectedGame(game.component)}>
                  Play Game
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Games;
