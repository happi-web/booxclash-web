import React, { useState } from 'react';
import Sidebar from './students/components/SideBar';
import ContentDisplay from './students/components/ContentDisplay';
import Profile from './Profile';

const StudentDashboard: React.FC = () => {
  const [selectedContentType, setSelectedContentType] = useState<'video' | 'simulation' | 'flashcard' | 'game' | 'vr_ar' | 'profile'>('profile');

  // This function is passed down to the Sidebar component
  const handleContentTypeSelect = (contentType: 'video' | 'simulation' | 'flashcard' | 'game' | 'vr_ar' | 'profile') => {
    setSelectedContentType(contentType);  // Update selected content type
  };

  return (
    <div className="dashboard">
      <Profile/>
      <Sidebar onContentTypeSelect={handleContentTypeSelect} /> {/* Passing the handler */}
      <div className="content-area">
        <ContentDisplay selectedContentType={selectedContentType} />
      </div>
    </div>
  );
};

export default StudentDashboard;
