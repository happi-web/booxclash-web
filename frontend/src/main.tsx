import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Play from './components/Play';
import Learn from './components/Learn';
import Support from './components/Support';
import Chat from './components/Chat';
import ScienceLessons from './components/ScienceLessons';
import MathLessons from './components/MathLessons';
import MathGames from './components/MathGames';
import ScienceGames from './components/ScienceGames';
import Knockout from './components/games/Knockout';
import NumberHunt from './components/games/NumberHunt';


const Main: React.FC = () => {
  return (
    <BrowserRouter basename="/booxclash-web">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/mathLessons" element={<MathLessons />} />
        <Route path="/support" element={<Support />} />
        <Route path="/scienceLessons" element={<ScienceLessons />} />
        <Route path="/mathGames" element={<MathGames />} />
        <Route path="/scienceGames" element={<ScienceGames />} />
        <Route path="/knockout" element={<Knockout/>} />
        <Route path="/numberHunt" element={<NumberHunt/>} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Main />);
