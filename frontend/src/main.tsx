import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import Home from './components/Home';
import Play from './components/Play';
import Learn from './components/Learn';
import Support from './components/Support';
import ScienceLessons from './components/ScienceLessons';
import MathLessons from './components/MathLessons';
import MathGames from './components/MathGames';
import ScienceGames from './components/ScienceGames';
import Knockout from './components/games/Lobby';
import NumberHunt from './components/games/NumberHunt';
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Profile from './components/Profile';
import UserManagement from './components/UserManagement';
import ContentUpload from './components/ContentUpload';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Games from './components/students/components/Games';
import GameRoom from "./components/games/GameRoom";
import ParentDashboard from './components/ParentDashboard';
import RegisterChild from './components/RegisterChild';
import ChildLogin from './components/ChildLogin';
import Lessons from './components/students/components/Lessons';
import SciencePathway from './components/students/components/SciencePathway';
import MathPathway from './components/students/components/MathPathway';
import PathwaySteps from "./components/PathwaySteps";


// Define the user type with only username and token
interface User {
  username: string;
  token: string;
  role: string;  // Token for authentication
}

const Main: React.FC = () => {
  // State to store logged-in user with updated type
  const [, setUser] = useState<User | null>(null);

  return (
    <BrowserRouter basename="/booxclash-web">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/support" element={<Support />} />
        <Route path="/mathLessons" element={<MathLessons />} />
        <Route path="/scienceLessons" element={<ScienceLessons />} />
        <Route path="/mathGames" element={<MathGames />} />
        <Route path="/scienceGames" element={<ScienceGames />} />
        <Route path="/knockout" element={<Knockout />} />
        <Route path="/numberHunt" element={<NumberHunt />} />
        <Route path="/game" element={<Games />} />
        <Route path="/lessons/:lessonId" element={<Lessons />} />
        <Route path="/pathway/:pathwayId" element={<PathwaySteps />} />


        <Route path="/signup" element={<SignUp setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/child-login" element={<ChildLogin/>} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="/science" element={<SciencePathway />} />
        <Route path="/math" element={<MathPathway />} />
        <Route path="/registerChild" element={<RegisterChild />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/content-upload" element={<ContentUpload />} />
        <Route path="/game-room/:roomId" element={<GameRoom />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Main />);
