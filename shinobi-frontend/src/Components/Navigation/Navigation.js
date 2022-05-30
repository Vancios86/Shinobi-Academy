import './Navigation.css';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div className='navigation'>
      {/* hamburger */}
      <input type='checkbox' id='navi-toggle' className='checkbox' />
      <label htmlFor='navi-toggle' className='button'>
        <span className='icon'>&nbsp;</span>
      </label>
      <div className='background'>&nbsp;</div>
      {/* nav */}
      <nav className='nav'>
        <ul className='menu-items-list'>
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
    </div>
  );
};

export default Navigation;
