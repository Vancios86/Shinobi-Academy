import './ClassesPage.css';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';

const ClassesPage = () => {
  return (
    <div className='classes-page grid'>
      <ParallaxProvider>
        <Parallax opacity={[3, 0]}>
          <div className='flow'>
            <div className='page-title' id='classes-page'>
              <h3 id='classes-page'>Classes</h3>
            </div>

            <div className='classes-content shadowed-box grid text-silver'>
              <div className='classes class-s'>
                <div className='classes-name'>
                  <h3>
                    MMA <br /> Box <br /> Muay-Thai
                  </h3>
                </div>

                <Parallax opacity={[0, 2]}>
                  <p className='classes-text-right'>
                    our classes Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Corporis, nesciunt totam nostrum provident
                    quis placeat minus sunt architecto assumenda consequuntur?
                  </p>
                </Parallax>
              </div>

              <div className='classes class-jj'>
                <div className='classes-name'>
                  <h3>
                    BJJ <br /> Grappling
                  </h3>
                </div>
                <Parallax opacity={[0, 2]}>
                  <p className='classes-text-left'>
                    our classes Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Corporis, nesciunt totam nostrum provident
                    quis placeat minus sunt architecto assumenda consequuntur?
                  </p>
                </Parallax>
              </div>

              <div className='classes class-w'>
                <div className='classes-name'>
                  <h3>
                    Wrestling <br /> Judo
                  </h3>
                </div>
                <Parallax opacity={[0, 2]}>
                  <p className='classes-text-right'>
                    our classes Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Corporis, nesciunt totam nostrum provident
                    quis placeat minus sunt architecto assumenda consequuntur?
                  </p>
                </Parallax>
              </div>

              <div className='classes class-c'>
                <div className='classes-name'>
                  <h3>
                    Strength <br /> Condition
                  </h3>
                </div>
                <Parallax opacity={[0, 2]}>
                  <p className='classes-text-left'>
                    our classes Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Corporis, nesciunt totam nostrum provident
                    quis placeat minus sunt architecto assumenda consequuntur?
                  </p>
                </Parallax>
              </div>

              <div className='schedule-button'>
                <button className='button-large'>
                  <Link to='/schedule'>View schedule</Link>
                </button>
              </div>
            </div>
          </div>
        </Parallax>
      </ParallaxProvider>
    </div>
  );
};

export default ClassesPage;
