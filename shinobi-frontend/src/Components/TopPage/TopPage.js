import './TopPage.css';
import Navigation from '../Navigation/Navigation';
import Logo from '../Logo/Logo';

const TopPage = () => {
  return (
    <div className='top-page'>
      <div className='top-content'>
        <div className='top-logo flex'>
          <Logo />
        </div>
        <div className='page-title' id='welcome-text'>
          <h3 data-text='Welcome to Shinobi Academy'>
            Welcome to <span>Shinobi</span> Academy
          </h3>
        </div>
        <div id='to-top'></div>
        <div className='shadowed-box' id='nav-container'>
          <Navigation />
        </div>
        <div className='partners-logos'>
          <div className='partner1'></div>
          <div className='partner2'></div>
          <div className='partner3'></div>
        </div>
      </div>
    </div>
  );
};

export default TopPage;
