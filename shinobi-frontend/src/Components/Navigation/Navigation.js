import './Navigation.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (e) => {
    setIsExpanded(e.target.checked);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isExpanded) {
      e.preventDefault();
      const checkbox = document.getElementById('menu-toggle');
      if (checkbox) {
        checkbox.checked = false;
        setIsExpanded(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded, handleKeyDown]);

  // Announce menu state changes to screen readers
  useEffect(() => {
    if (isExpanded) {
      // Announce menu opened
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = 'Navigation menu opened';
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [isExpanded]);
  return (
    <nav className="menu" role="navigation" aria-label="Main navigation">
      <input 
        className="menu-toggler" 
        type="checkbox" 
        id="menu-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={isExpanded}
        onChange={handleToggle}
      />
      <label
        htmlFor="menu-toggle"
        className="menu-toggler-label border-dark shadowed-box"
        aria-hidden="true"
      >
        <span className="Navigation-icon" aria-hidden="true">&nbsp;</span>
      </label>
      <ul role="menu" aria-label="Navigation options">
        <li className="menu-item" role="none">
          <Link to="/camps" role="menuitem" className="shadowed-box">Camps </Link>
        </li>
        <li className="menu-item" role="none">
          <a href="#about-page" role="menuitem" className="shadowed-box">About</a>
        </li>
        <li className="menu-item" role="none">
          <a href="#classes-page" role="menuitem" className="shadowed-box">Classes</a>
        </li>
        <li className="menu-item" role="none">
          <Link to="/schedule" role="menuitem" className="shadowed-box">Schedule</Link>
        </li>
        <li className="menu-item" role="none">
          <Link to="/gallery" role="menuitem" className="shadowed-box">Gallery</Link>
        </li>
        <li className="menu-item" role="none">
          <a href="#contact" role="menuitem" className="shadowed-box">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
