import './MainNav.css';
import { Link } from 'react-router-dom';

const MainNav = () => {
  return (
    <nav className='menu'>
      <input className='menu-toggler' type='checkbox' />
      <label htmlFor='menu-toggler' className='menu-toggler-label'>
        <span className='mainNav-icon'>&nbsp;</span>
      </label>
      <ul>
        <li className='menu-item'>
          <Link to='/Camps'>Camps</Link>
        </li>
        <li className='menu-item'>
          <Link to='/About'>About</Link>
        </li>
        <li className='menu-item'>
          <Link to='/Classes'>Classes</Link>
        </li>
        <li className='menu-item'>
          <Link to='/Schedule'>Schedule</Link>
        </li>
        <li className='menu-item'>
          <Link to='/Gallery'>Gallery</Link>
        </li>
        <li className='menu-item'>
          <Link to='/Blog'>Blog</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNav;
