type SidebarProps = {
    onSelect: (component: string) => void;
  };
  
  const StudentSideBar: React.FC<SidebarProps> = ({ onSelect }) => {
    return (
      <div style={{ width: '250px', background: '#f4f4f4', padding: '20px' }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li onClick={() => onSelect('Profile')} style={{ cursor: 'pointer', margin: '10px 0' }}>
            Profile
          </li>
          <li onClick={() => onSelect('Pathway')} style={{ cursor: 'pointer', margin: '10px 0' }}>
            Pathways
          </li>
          <li onClick={() => onSelect('Games')} style={{ cursor: 'pointer', margin: '10px 0' }}>
            Competitions
          </li>
          <li onClick={() => onSelect('Science Virtual Lab')} style={{ cursor: 'pointer', margin: '10px 0' }}>
            Science Virtual Lab
          </li>
        </ul>
      </div>
    );
  };
  
  export default StudentSideBar;
  
  