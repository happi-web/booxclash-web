type SidebarProps = {
  onSelect: (component: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  return (
    <div style={{ width: '250px', background: '#f4f4f4', padding: '20px' }}>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li onClick={() => onSelect('Profile')} style={{ cursor: 'pointer', margin: '10px 0' }}>
          Profile
        </li>
        <li onClick={() => onSelect('ContentUpload')} style={{ cursor: 'pointer', margin: '10px 0' }}>
          Content Upload
        </li>
        <li onClick={() => onSelect('UserManagement')} style={{ cursor: 'pointer', margin: '10px 0' }}>
          User Management
        </li>
        <li onClick={() => onSelect('Analytics')} style={{ cursor: 'pointer', margin: '10px 0' }}>
          Analytics
        </li>
        <li onClick={() => onSelect('Settings')} style={{ cursor: 'pointer', margin: '10px 0' }}>
          Settings
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

