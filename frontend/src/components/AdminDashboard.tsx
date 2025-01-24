import { useState } from 'react';
import Analytics from './Analytics';
import ContentUpload from './ContentUpload';
import Profile from './Profile';
import Settings from './Settings';
import Sidebar from './Sidebar';
import UserManagement from './UserManagement';
import NavBar from './NavBar';

const AdminDashboard = () => {
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState('ContentUpload');

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case 'Profile':
        return <Profile />;
      case 'ContentUpload':
        return <ContentUpload />;
      case 'UserManagement':
        return <UserManagement />;
      case 'Analytics':
        return <Analytics />;
      case 'Settings':
        return <Settings />;
      default:
        return <Profile />;
    }
  };

  return (
    <>
    <NavBar/>
    <div className="dashboard" style={{ display: 'flex' }}>
      <Sidebar onSelect={setActiveComponent} />
      <div style={{ flex: 1, padding: '20px' }}>
        {renderComponent()}
      </div>
    </div>
    </>

  );
};

export default AdminDashboard;
