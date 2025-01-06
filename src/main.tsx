import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Play from './components/Play';
import Learn from './components/Learn';
import Support from './components/Support';
import Engage from './components/Engage';
import Lessons from './components/Lessons';


const Main: React.FC = () => {
  return (
    <BrowserRouter basename="/booxclash-web">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/engage" element={<Engage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/lessons" element={<Lessons />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Main />);
