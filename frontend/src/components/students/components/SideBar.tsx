import React from 'react';

// Defining the type for content type selection
interface SidebarProps {
  onContentTypeSelect: (contentType: 'video' | 'simulation' | 'flashcard' | 'game' | 'vr_ar' | 'profile') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onContentTypeSelect }) => {
  const handleClick = (contentType: 'video' | 'simulation' | 'flashcard' | 'game' | 'vr_ar' | 'profile') => {
    onContentTypeSelect(contentType); // Notify parent about selected content type
  };

  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => handleClick('video')}>Videos</li>
        <li onClick={() => handleClick('simulation')}>Simulations</li>
        <li onClick={() => handleClick('flashcard')}>Flashcards</li>
        <li onClick={() => handleClick('game')}>Games</li>
        <li onClick={() => handleClick('vr_ar')}>VR/AR</li>
        <li onClick={() => handleClick('profile')}>Profile</li>
      </ul>
    </div>
  );
};

export default Sidebar;
