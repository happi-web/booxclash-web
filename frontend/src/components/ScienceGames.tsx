import { useNavigate } from "react-router-dom";
import "./css/index.css";
import NavBar from "./NavBar";

const gameImages = [
  { src: "/booxclash-web/images/connect.jpg", route: "/numberHunt" },
  { src: "/booxclash-web/images/connect.jpg", route: "/knockout" },
  { src: "/booxclash-web/images/game3.jpg", route: "/game3" },
  { src: "/booxclash-web/images/game4.jpg", route: "/game4" },
  { src: "/booxclash-web/images/game5.jpg", route: "/game5" },
];

const ScienceGames = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  return (
    <>
      <NavBar />
      <div className="main-container">
        <div className="header-title">
          <h1>Welcome To Game Science Zone</h1>
        </div>
        <div className="grid">
          {gameImages.map((game, index) => (
            <div className="grid-item" key={index}>
              <div className="thumbnail">
                <img src={game.src} alt={`Game ${index + 1}`} />
              </div>
              <button
                className="start-button"
                onClick={() => navigate(game.route)}
              >
                Start Game
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScienceGames;
