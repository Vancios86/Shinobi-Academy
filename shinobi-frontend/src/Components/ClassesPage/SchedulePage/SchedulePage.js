import './SchedulePage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SchedulePage = () => {
  useEffect(() => {
    console.log(
      'X position :',
      window.scrollX,
      ' |Y position: ',
      window.scrollY
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
  const navigate = useNavigate();
  return (
    <div className='schedule-page container'>
      <div className='welcome-logo flex'>
        <Logo />
      </div>

      <button
        className='back-button flex'
        onClick={() => {
          navigate(-1);
        }}
      >
        <b>↞</b>
      </button>

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
