import React, { ReactNode } from "react";
import "../css/index.css";

interface GameBackgroundProps {
  title: string;
  children: ReactNode;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ title, children }) => {
  return (
    <div className="game-background">
      <div className="overlay">
        <div className="game-header">
          <h1>{title}</h1>
        </div>
        <div className="game-content">{children}</div>
      </div>
    </div>
  );
};

export default GameBackground;
