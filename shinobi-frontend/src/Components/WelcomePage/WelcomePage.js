import './WelcomePage.css';
import MainNav from '../Navigation/MainNav';
import Logo from '../Logo/Logo';
import { Parallax } from 'react-scroll-parallax';
import ShinobiVideo from './SHINOBI.mp4';

const WelcomePage = () => {
  return (
    <div className='welcome-page'>
      <div className='welcome-content'>
        <div className='welcome-logo flex'>
          <Logo />
        </div>
        <Parallax speed={-30}>
          <div className='page-title' id='welcome-text'>
            <h3 data-text='Welcome to Shinobi Academy'>
              Welcome to <span>Shinobi</span> Academy
            </h3>
          </div>
        </Parallax>
        <Parallax speed={30} opacity={[1]}>
          <div className='nav-container'>
            <video width={'100%'} autoPlay={'on'} loop={'on'} muted>
              <source src={ShinobiVideo} type='video/mp4' />
            </video>
            <MainNav />
          </div>
        </Parallax>
      </div>
    </div>
  );
};

export default WelcomePage;
