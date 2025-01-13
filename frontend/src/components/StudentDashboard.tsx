import { useState } from 'react';
import Profile from './Profile';
import Videos from './students/components/Videos';
import Simulations from './students/components/Simulations';
import Games from './students/components/Games';
import FlashCards from './students/components/FlashCards';
import VRAR from './students/components/VR-AR';
import StudentSideBar from './StudentSideBar';
import NavBar from './NavBar';

const StudentDashboard = () => {
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState('ContentUpload');

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Profile':
        return <Profile />;
      case 'Videos':
        return <Videos />;
      case 'Simulations':
        return <Simulations />;
      case 'Games':
        return <Games />;
      case 'FlashCards':
        return <FlashCards />;
      case 'VRAR':
          return <VRAR />;
      default:
        return <Profile />;
    }
  };

  return (
    <>
    <NavBar/>
        
      <div className="dashboard" style={{ display: 'flex' }}>
      <StudentSideBar onSelect={setActiveComponent} />
      <div style={{ flex: 1, padding: '20px' }}>
        {renderComponent()}
      </div>
    </div>
    </>

  );
};

export default StudentDashboard;
