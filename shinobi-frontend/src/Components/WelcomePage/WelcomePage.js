import './WelcomePage.css';
import MainNav from '../Navigation/MainNav';
import Logo from '../Logo/Logo';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

const WelcomePage = () => {
  return (
    <ParallaxProvider>
      <div className='welcome-page'>
        <div className='welcome-content'>
          <div className='welcome-logo flex'>
            <Logo />
          </div>
          <Parallax speed={-30} opacity={[1, 0]}>
            <div className='page-title' id='welcome-text'>
              <h3>Welcome to Shinobi Academy</h3>
            </div>
          </Parallax>
          <div className='flex nav-container'>
            <video className='media-content flex'>fallback</video>
            <MainNav />
          </div>
        </div>
      </div>
    </ParallaxProvider>
  );
};

export default WelcomePage;
