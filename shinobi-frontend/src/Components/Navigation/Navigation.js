import './Navigation.css';
// import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className='menu'>
      <input className='menu-toggler' type='checkbox' />
      <label htmlFor='menu-toggler' className='menu-toggler-label'>
        <span className='Navigation-icon'>&nbsp;</span>
      </label>
      <ul>
        <li className='menu-item'>
          <a href='/Camps'>Camps</a>
        </li>
        <li className='menu-item'>
          <a href='/#about-page'>About</a>
        </li>
        <li className='menu-item'>
          <a href='/#classes-page'>Classes</a>
        </li>
        <li className='menu-item'>
          <a href='/Schedule'>Schedule</a>
        </li>
        <li className='menu-item'>
          <a href='/Gallery'>Gallery</a>
        </li>
        <li className='menu-item'>
          <a href='/Blog'>Blog</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
