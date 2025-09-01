import './CampsComponent.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';
import backgroundImage from '../../../assets/images/camps-background.webp';

const CampsComponent = () => {
  return (
    <Parallax opacity={[3, 0]}>
      <div className='camps-component preview-component container flow shadowed-box rounded-sm'>
        <div className='component-title'>
          <h3 id='camps-component-title'>Camps</h3>
        </div>
        <div className='container flex'>
          <p className='text-content text-white' id='camps-component-text'>
            We run our own training camps and welcome guests and coaches from
            all over the world throughout the year...wanna join us?
          </p>
        </div>
        <div className='component-button flex'>
          <button className='button-large'>
            <Link to='/camps'>View details</Link>
          </button>
        </div>
        <div
          className='camps-background rounded-sm'
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>
      </div>
    </Parallax>
  );
};

export default CampsComponent;
