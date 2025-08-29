import './SchedulePage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSchedule } from '../../../contexts/ScheduleContext';
import { useClasses } from '../../../contexts/ClassesContext';

const SchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getAllScheduleData, getDaysOfWeek, isLoaded: scheduleLoaded } = useSchedule();
  const { getAllClasses, isLoaded: classesLoaded } = useClasses();
  
  // Scroll to top when component mounts or route changes
  useEffect(() => {
    // Use a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when the pathname changes
  
  const scheduleData = getAllScheduleData();
  const daysOfWeek = getDaysOfWeek();
  const classes = getAllClasses();

  if (!scheduleLoaded || !classesLoaded) {
    return (
      <div className='schedule-page container'>
        <div className='welcome-logo flex'>
          <Logo />
        </div>
        <div className='schedule-page-content'>
          <div className='page-title'>
            <h3>Weekly Schedule</h3>
          </div>
          <div className='loading-message'>
            <p>Loading schedule...</p>
          </div>
        </div>
        <div className='secondary-page-footer'>
          <Footer />
        </div>
      </div>
    );
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getClassInfo = (classId) => {
    return classes.find(c => c.id === classId);
  };

  return (
    <div className='schedule-page container'>
      <div className='welcome-logo flex'>
        <Logo />
      </div>

      <button
        className='back-button flex rounded-sm'
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
        
        <div className='dynamic-schedule-container'>
          {daysOfWeek.map(day => {
            const dayEntries = scheduleData.weeklySchedule[day] || [];
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            
            return (
              <div key={day} className='schedule-day'>
                <h4 className='day-title'>{dayName}</h4>
                
                {dayEntries.length === 0 ? (
                  <div className='no-classes-day'>
                    <p>No classes scheduled</p>
                  </div>
                ) : (
                  <div className='day-classes'>
                    {dayEntries
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map(entry => {
                        const classInfo = getClassInfo(entry.classId);
                        
                        return (
                          <div key={entry.id} className={`schedule-class ${entry.isActive ? 'active' : 'inactive'}`}>
                            <div className='class-time'>
                              <span className='start-time'>{formatTime(entry.time)}</span>
                              <span className='time-separator'>-</span>
                              <span className='end-time'>{formatTime(entry.endTime)}</span>
                            </div>
                            
                            <div className='class-details'>
                              <h5 className='class-name'>{entry.className || 'Class TBD'}</h5>
                              <p className='class-instructor'>Instructor: {entry.instructor}</p>
                              <p className='class-level'>Level: {entry.level}</p>
                              {entry.description && (
                                <p className='class-description'>{entry.description}</p>
                              )}
                              {classInfo && classInfo.description && !entry.description && (
                                <p className='class-description'>{classInfo.description}</p>
                              )}
                            </div>
                            
                            <div className='class-status'>
                              <span className={`status-badge ${entry.isActive ? 'active' : 'inactive'}`}>
                                {entry.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SchedulePage;
