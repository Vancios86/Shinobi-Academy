import './ClassesPage.css';
import { Parallax } from 'react-scroll-parallax';
import { Link, useLocation } from 'react-router-dom';
import { useClasses } from '../../contexts/ClassesContext';
import { useEffect } from 'react';

const ClassesPage = () => {
  const { getAllClasses, isLoaded } = useClasses();
  const classes = getAllClasses();
  const location = useLocation();

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

  if (!isLoaded) {
    return (
      <div className='classes-page grid'>
        <div className='flow'>
          <div className='page-title variation-3' id='classes-page'>
            <h3 id='classes-page'>Classes</h3>
            <div className='page-title-accent-line'></div>
          </div>
          <div className='classes-content shadowed-box grid text-silver'>
            <div className='loading-message'>
              <p>Loading classes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='classes-page grid'>
      <div className='flow'>
        <div className='page-title variation-3' id='classes-page'>
          <h3 id='classes-page'>Classes</h3>
          <div className='page-title-accent-line'></div>
        </div>

        <div className='classes-content shadowed-box grid text-silver'>
          {classes.map((classItem, index) => {
            // Automatic alternating layout: even indices (0, 2, 4...) = image left, text right
            // odd indices (1, 3, 5...) = image right, text left
            const isRightPositioned = index % 2 === 1;
            
            return (
              <div 
                key={classItem.id} 
                className='classes'
                style={{
                  backgroundImage: classItem.imageType === 'predefined' 
                    ? `url(/assets/classes-assets/${classItem.image})`
                    : `url(${classItem.image})`,
                  backgroundPositionY: 'center', // Standard position
                  justifySelf: isRightPositioned ? 'flex-end' : 'flex-start',
                  width: '88%',
                  flexDirection: isRightPositioned ? 'row-reverse' : 'row'
                }}
              >
                <div className='classes-name'>
                  <h3>{classItem.name}</h3>
                </div>
                <Parallax speed={10}>
                  <p className={`classes-text-${isRightPositioned ? 'right' : 'left'}`}>
                    {classItem.description}
                  </p>
                </Parallax>
              </div>
            );
          })}

          <div className='schedule-button'>
            <button className='button-large'>
              <Link to='/schedule'>View schedule</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;
