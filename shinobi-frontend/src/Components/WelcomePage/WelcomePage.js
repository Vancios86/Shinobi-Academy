import './WelcomePage.css';
import MainNav from '../Navigation/MainNav';
import Logo from '../Logo/Logo';

const WelcomePage = () => {
  return (
    <div className='welcome-page'>
      <div className='welcome-content'>
        <div className='welcome-logo flex'>
          <Logo />
        </div>

        <div className='page-title' id='welcome-text'>
          <h3>Welcome to Shinobi Academy</h3>
        </div>

        <div className='flex nav-container'>
          <video className='media-content flex'>fallback</video>
          <MainNav />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
