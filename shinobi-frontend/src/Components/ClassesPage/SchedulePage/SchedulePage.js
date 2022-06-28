import './SchedulePage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';

const SchedulePage = () => {
  return (
    <div className='schedule-page container'>
      <div className='welcome-logo flex'>
        <Logo />
      </div>
      <div className='schedule-page-content'>
        <div className='page-title'>
          <h3>Weekly Schedule</h3>
        </div>
        <div className='schedule-container container flow'></div>
      </div>
      <div className='secondary-page-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default SchedulePage;
