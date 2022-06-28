import './Navigation.css';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className='menu'>
      <input className='menu-toggler' type='checkbox' />
      <label htmlFor='menu-toggler' className='menu-toggler-label'>
        <span className='Navigation-icon'>&nbsp;</span>
      </label>
      <ul>
        <li className='menu-item'>
          <Link to='/Camps'>Camps </Link>
        </li>
        <li className='menu-item'>
          <a href='/#about-page'>About</a>
        </li>
        <li className='menu-item'>
          <a href='/#classes-page'>Classes</a>
        </li>
        <li className='menu-item'>
          <Link to='/schedule'>Schedule</Link>
        </li>
        <li className='menu-item'>
          <Link to='/gallery'>Gallery</Link>
        </li>
        <li className='menu-item'>
          <a href='/#contact'>Contact</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
