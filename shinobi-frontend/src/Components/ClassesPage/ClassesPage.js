import './ClassesPage.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';

const ClassesPage = () => {
  return (
    <div className='classes-page grid'>
      <div className='classes-page-content'>
        <div className='container flow'>
          <div className='page-title' id='classes-page'>
            <h3 id='classes-page'>Classes</h3>
          </div>

          <div className='grid text-silver'>
            <Parallax speed={5} opacity={[1, 0.77]}>
              <div className='classes class-jj'>
                <div className='classes-name'>
                  <h3>JiuJitsu</h3>
                </div>

                <Parallax speed={-13} opacity={[0, 2]}>
                  <p className='classes-text-right'>
                    our classes Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Corporis, nesciunt totam nostrum provident
                    quis placeat minus sunt architecto assumenda consequuntur?
                  </p>
                </Parallax>
              </div>
            </Parallax>

            <Parallax speed={0} opacity={[1, 0.77]}>
              <div className='classes class-s'>
                <div className='classes-name'>
                  <h3>MMA</h3>
                </div>
                <Parallax speed={-18} opacity={[0, 2]}>
                  <p className='classes-text-left'>
                    our classes Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Corporis, nesciunt totam nostrum provident
                    quis placeat minus sunt architecto assumenda consequuntur?
                  </p>
                </Parallax>
              </div>
            </Parallax>
            <Parallax speed={5} opacity={[1, 0.77]}>
              <div className='classes class-w'>
                <div className='classes-name'>
                  <h3>Wrestling</h3>
                </div>
                <Parallax speed={-13} opacity={[0, 2]}>
                  <p className='classes-text-right'>
                    our classes Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Corporis, nesciunt totam nostrum provident
                    quis placeat minus sunt architecto assumenda consequuntur?
                  </p>
                </Parallax>
              </div>
            </Parallax>
            <Parallax speed={0} opacity={[1, 0.77]}>
              <div className='classes class-spar'>
                <div className='classes-name'>
                  <h3>Sparring</h3>
                </div>
                <Parallax speed={-18} opacity={[0, 2]}>
                  <p className='classes-text-left'>
                    our classes Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Corporis, nesciunt totam nostrum provident
                    quis placeat minus sunt architecto assumenda consequuntur?
                  </p>
                </Parallax>
              </div>
            </Parallax>
            <div className='schedule-button'>
              <button className='button-large'>
                <Link to='/schedule'>View schedule</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassesPage;
