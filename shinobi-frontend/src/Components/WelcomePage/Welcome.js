import './Welcome.css';
import MainNav from '../Navigation/MainNav';
import Logo from '../Logo/Logo';

const Welcome = () => {
  return (
    <>
      <div className='welcome-content'>
        <div className='welcome-logo flex'>
          <Logo />
        </div>

        <div className='text-content text-dark container flex'>
          <p className='fs-400'>Welcome to Shinobi Academy Lagos</p>
        </div>

        <div className='flex nav-container'>
          <video className='media-content flex'>fallback</video>
          <MainNav />
        </div>
      </div>
    </>
  );
};

export default Welcome;
