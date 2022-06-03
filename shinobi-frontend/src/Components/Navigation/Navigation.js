import './Navigation.css';
import { Link } from 'react-router-dom';
// import MainNav from './MainNav';

const Navigation = () => {
  return (
    <div className='pages-navigation'>
      {/* hamburger */}
      <input type='checkbox' id='navi-toggle' className='checkbox' />
      <label htmlFor='navi-toggle' className='button'>
        <span className='icon'>&nbsp;</span>
      </label>
      <div className='background'>&nbsp;</div>

      <nav className='page-menu'>
        <input className='page-menu-toggler' type='checkbox' />
        <label htmlFor='page-menu-toggler' className='page-menu-toggler-label'>
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

      {/* <MainNav /> */}
      {/* nav */}
      {/* <nav className='pages-nav'>
        <ul className='pages-menu-items-list grid'>
          <li className='pages-menu-item'>
            <Link to='/Camps'>Camps</Link>
          </li>
          <li className='pages-menu-item'>
            <Link to='/About'>About</Link>
          </li>
          <li className='pages-menu-item'>
            <Link to='/Classes'>Classes</Link>
          </li>
          <li className='pages-menu-item'>
            <Link to='/Schedule'>Schedule</Link>
          </li>
          <li className='pages-menu-item'>
            <Link to='/Gallery'>Gallery</Link>
          </li>
          <li className='pages-menu-item'>
            <Link to='/Blog'>Blog</Link>
          </li>
        </ul>
      </nav> */}
    </div>
  );
};

export default Navigation;
