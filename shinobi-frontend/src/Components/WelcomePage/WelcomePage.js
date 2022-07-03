import './WelcomePage.css';
import Navigation from '../Navigation/Navigation';
import Logo from '../Logo/Logo';
import { Parallax } from 'react-scroll-parallax';
import ShinobiVideo from './SHINOBI.mp4';
import { useState, useEffect } from 'react';

const WelcomePage = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  window.onresize = () => {
    setWindowSize(window.innerWidth);
  };
  useEffect(() => {
    const video = document.querySelector('.nav-container video');
    const fallback = document.querySelector('.nav-container .mobile-devices');
    if (windowSize >= 600) {
      video.setAttribute('autoplay', '');
      video.style.display = '';
      video.classList.remove('sr-only');
      fallback.classList.add('sr-only');
    }
    if (windowSize < 600) {
      video.style.display = 'none';
      fallback.classList.remove('sr-only');
    }
  }, [windowSize]);
  return (
    <div className='welcome-page'>
      <div className='welcome-content'>
        <div className='welcome-logo flex'>
          <Logo />
        </div>
        <Parallax speed={-30} opacity={[3, -1.2]}>
          <div className='page-title' id='welcome-text'>
            <h3 data-text='Welcome to Shinobi Academy'>
              Welcome to <span>Shinobi</span> Academy
            </h3>

            <div className='down-arrow'>
              <button>
                <a href='#main-video' id='down-arrow'>
                  <b>↡</b>
                </a>
              </button>
            </div>
          </div>
        </Parallax>
        <Parallax speed={0}>
          <div className='nav-container' id='main-video'>
            <video width={'100%'} preload='none' loop muted className='sr-only'>
              <source src={ShinobiVideo} type='video/mp4' />
            </video>
            <div className='mobile-devices shadowed-box'>
              <p className='text-white'>video in portrait mode to come</p>
            </div>
            <Navigation />
          </div>
        </Parallax>
      </div>
    </div>
  );
};

export default WelcomePage;
