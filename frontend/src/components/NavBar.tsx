import  { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className='container-content'>
      <div className="header">
        <div className="logo">
          <Link to="/"><img src="/booxclash-web/images/logo.png" alt="BooxClash Logo" /></Link>
        </div>
        <nav className={`navbar ${menuOpen ? 'active' : ''}`}>
          <ul className="menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/game-room/:roomId">Support</Link></li>
            <li><Link to="/signup">SignUp</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
