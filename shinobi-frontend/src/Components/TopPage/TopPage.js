import './TopPage.css';
import Navigation from '../Navigation/Navigation';
import Logo from '../Logo/Logo';

const TopPage = () => {
  return (
    <div className='top-page'>
      <div className='top-content'>
        <div className='top-logo flex' id='to-top'>
          <Logo />
        </div>
        
        {/* Separate Title Section */}
        <div className='title-section'>
          <h1 className='hero-title'>
            Welcome to <span className='accent-text'>Shinobi</span> Academy
          </h1>
        </div>

        {/* Enhanced Hero Section */}
        <div className='hero-section'>
          <div className='hero-background shadowed-box'>
            <div className='hero-overlay'></div>
            <div className='hero-content'>
              <p className='hero-subtitle'>
                Master the art of martial arts through expert training, discipline, and tradition
              </p>
              <div className='hero-navigation'>
                <div className='nav-wrapper'>
                  <Navigation />
                </div>
              </div>
              <div className='hero-features'>
                <div className='feature-item'>
                  <div className='feature-icon'>🥋</div>
                  <span>Expert Coaching</span>
                </div>
                <div className='feature-item'>
                  <div className='feature-icon'>⚡</div>
                  <span>Proven Methods</span>
                </div>
                <div className='feature-item'>
                  <div className='feature-icon'>🏆</div>
                  <span>Championship Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='break-top'></div>
        

        
        <div className='partners-logos'>
          <div
            className='partner1'
            onClick={() => window.open('https://www.revgear.com/')}
          ></div>
          <div
            className='partner2'
            onClick={() => window.open('https://www.mcgregorfast.com/')}
          ></div>
          <div
            className='partner3'
            onClick={() => window.open('https://www.fujimats.com/')}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TopPage;
