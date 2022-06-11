import './ClassesPage.css';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

const ClassesPage = () => {
  return (
    <ParallaxProvider>
      <div className='classes-page grid'>
        <div className='classes-page-content'>
          <section className='container flow'>
            <Parallax speed={-18} opacity={[1, 0]}>
              <div className='page-title' id='classes-page'>
                <h3>Classes</h3>
              </div>
            </Parallax>

            <div className='grid fs-600 text-silver'>
              <Parallax speed={5} opacity={[1, 0.77]}>
                <div className='classes class-jj'>
                  <h3>JiuJitsu</h3>
                </div>
              </Parallax>
              <Parallax speed={0} opacity={[1, 0.77]}>
                <div className='classes class-s'>
                  <h3>Striking</h3>
                </div>
              </Parallax>
              <Parallax speed={5} opacity={[1, 0.77]}>
                <div className='classes class-w'>
                  <h3>MMA Positional</h3>
                </div>
              </Parallax>
              <Parallax speed={0} opacity={[1, 0.77]}>
                <div className='classes class-spar'>
                  <h3>Sparring</h3>
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
