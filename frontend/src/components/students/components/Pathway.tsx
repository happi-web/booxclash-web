import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Pathway.css"; 

const Pathway: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pathway-selection">
      <h1>Choose Your Learning Pathway</h1>
      <div className="pathway-options">
        <button className="math-button" onClick={() => navigate("/pathway/math")}>
          📘 Math Pathway
        </button>
        <button className="science-button" onClick={() => navigate("/pathway/science")}>
          🔬 Science Pathway
        </button>
      </div>
    </div>
  );
};

export default Pathway;
