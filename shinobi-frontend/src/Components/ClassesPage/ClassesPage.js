import './ClassesPage.css';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

const ClassesPage = () => {
  return (
    <ParallaxProvider>
      <div className='classes-page grid'>
        <div className='classes-page-content'>
          <section className='container flow'>
            {/* <Parallax speed={-16} opacity={[1, 0]}> */}
            <div className='page-title' id='classes-page'>
              <h3>Classes</h3>
            </div>
            {/* </Parallax> */}

            <div className='grid text-silver'>
              <Parallax speed={5} opacity={[1, 0.77]}>
                <div className='classes class-jj'>
                  <div className='classes-name'>
                    <h3>JiuJitsu</h3>
                  </div>

                  <Parallax speed={-18} opacity={[0, 2]}>
                    <p className='classes-text-right'>
                      our classes Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Corporis, nesciunt totam nostrum
                      provident quis placeat minus sunt architecto assumenda
                      consequuntur?
                    </p>
                  </Parallax>
                </div>
              </Parallax>
              <Parallax speed={0} opacity={[1, 0.77]}>
                <div className='classes class-s'>
                  <div className='classes-name'>
                    <h3>Striking</h3>
                  </div>
                  <Parallax speed={-18} opacity={[0, 2]}>
                    <p className='classes-text-left'>
                      our classes Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Corporis, nesciunt totam nostrum
                      provident quis placeat minus sunt architecto assumenda
                      consequuntur?
                    </p>
                  </Parallax>
                </div>
              </Parallax>
              <Parallax speed={5} opacity={[1, 0.77]}>
                <div className='classes class-w'>
                  <div className='classes-name'>
                    <h3>MMA Positional</h3>
                  </div>
                  <Parallax speed={-18} opacity={[0, 2]}>
                    <p className='classes-text-right'>
                      our classes Lorem ipsum dolor sit amet consectetur
                      adipisicing elit. Corporis, nesciunt totam nostrum
                      provident quis placeat minus sunt architecto assumenda
                      consequuntur?
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
                      adipisicing elit. Corporis, nesciunt totam nostrum
                      provident quis placeat minus sunt architecto assumenda
                      consequuntur?
                    </p>
                  </Parallax>
                </div>
              </Parallax>
            </div>
          </section>
        </div>
      </div>
    </ParallaxProvider>
  );
};

export default ClassesPage;
