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
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Main />);
