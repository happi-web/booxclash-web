import { useState } from 'react';
import ChildProfile from './ChildProfile';
import Games from './students/components/Games';
import ScienceVirtualLab from './students/components/ScienceVirtualLab';
import StudentSideBar from './StudentSideBar';
import NavBar from './NavBar';
import Pathway from './students/components/Pathway';

const StudentDashboard = () => {
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState('ContentUpload');

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Profile':
        return <ChildProfile/>;
      case 'Pathway':
        return <Pathway/>;
      case 'Games':
        return <Games />;
      case 'Science Virtual Lab':
        return <ScienceVirtualLab />;
      default:
        return <ChildProfile />;
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
