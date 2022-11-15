import './ClassesPage.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';

const ClassesPage = () => {
  return (
    <div className='classes-page grid'>
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
            <Parallax speed={9}>
              <p className='classes-text-right'>
                we will help you develop a strong and fluid striking foundation
                based on techniques from the most efficient disciplines in the
                world
              </p>
            </Parallax>
          </div>

          <div className='classes class-jj'>
            <div className='classes-name'>
              <h3>Brazilian Jiu-Jitsu</h3>
            </div>
            <Parallax speed={11}>
              <p className='classes-text-left'>
                self-defense practice emphasizing grappling fighting. A good
                workout that doesn't allow striking and teaches numerous
                life-changing lessons, including discipline, consistency, and
                combat methods
              </p>
            </Parallax>
          </div>

          <div className='classes class-w'>
            <div className='classes-name'>
              <h3>
                Wrestling <br /> Judo
              </h3>
            </div>
            <Parallax speed={13}>
              <p className='classes-text-right'>
                combat sports involving grappling-type techniques such as clinch
                fighting, throws and takedowns, joint locks, pins and other
                grappling holds which have been incorporated into martial arts,
                combat sports and military systems
              </p>
            </Parallax>
          </div>

          <div className='classes class-c'>
            <div className='classes-name'>
              <h3>
                Strength <br /> Condition
              </h3>
            </div>
            <Parallax speed={15}>
              <p className='classes-text-left'>
                the practical application of sports science to enhance movement
                quality, grounded in evidence-based research and physiology of
                exercise and anatomy
              </p>
            </Parallax>
          </div>

          <div className='classes class-private'>
            <div className='classes-name'>
              <h3>Private classes</h3>
            </div>
            <Parallax speed={17}>
              <p className='classes-text-right'>
                one-on-one training with a coach, tailored to your needs and at
                a time that suits you best - perfect for those who want to get
                the most out of their training
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
    </div>
  );
};

export default ClassesPage;
