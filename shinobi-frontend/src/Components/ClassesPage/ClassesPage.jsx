import './ClassesPage.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';
import { useClasses } from '../../contexts/ClassesContext';

const ClassesPage = () => {
  const { getAllClasses, isLoaded } = useClasses();
  const classes = getAllClasses();

  if (!isLoaded) {
    return (
      <div className='classes-page grid'>
        <div className='flow'>
          <div className='page-title' id='classes-page'>
            <h3 id='classes-page'>Classes</h3>
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
        <div className='page-title' id='classes-page'>
          <h3 id='classes-page'>Classes</h3>
        </div>

        <div className='classes-content shadowed-box grid text-silver'>
          {classes.map((classItem, index) => {
            // Determine if this class should be positioned on the right (even indices)
            const isRightPositioned = index % 2 === 1;
            
            return (
              <div 
                key={classItem.id} 
                className='classes'
                style={{
                  backgroundImage: `url(/assets/classes-assets/${classItem.image})`,
                  backgroundPositionY: classItem.imagePosition,
                  justifySelf: isRightPositioned ? 'flex-end' : 'flex-start',
                  width: '88%',
                  flexDirection: isRightPositioned ? 'row-reverse' : 'row'
                }}
              >
                <div className='classes-name'>
                  <h3>{classItem.name}</h3>
                </div>
                <Parallax speed={classItem.speed}>
                  <p className={`classes-text-${classItem.alignment}`}>
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
