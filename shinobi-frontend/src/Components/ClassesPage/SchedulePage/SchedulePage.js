import './SchedulePage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';

const SchedulePage = () => {
  return (
    <div className='schedule-page container'>
      <div className='welcome-logo flex'>
        <Logo />
      </div>
      <div className='back-button'>
        <button>&#11013;</button>
      </div>
      <div className='schedule-page-content'>
        <div className='page-title'>
          <h3>Weekly Schedule</h3>
        </div>
        <div className='schedule-container flow flex'>
          <h3>Here will be displayed the schedule</h3>
        </div>
      </div>
      <div className='secondary-page-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default SchedulePage;
