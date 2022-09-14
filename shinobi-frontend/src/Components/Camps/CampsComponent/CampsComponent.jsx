import './CampsComponent.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';

const CampsComponent = () => {
  return (
    <Parallax opacity={[3, 0]}>
      <div className='camps-component preview-component container flow'>
        <div className='component-title'>
          <h3 id='camps-component-title'>Camps</h3>
        </div>
        <div className='container flex'>
          <p className='text-content text-white' id='camps-component-text'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni
            eligendi perspiciatis est nisi iusto voluptas minima aliquid
            repellat tempora. Perferendis quos repellat praesentium magni atque
            repudiandae quod, dolorem id consectetur modi tenetur inventore!
          </p>
        </div>
        <div className='component-button flex'>
          <button className='button-large'>
            <Link to='/camps'>View details</Link>
          </button>
        </div>
        <div className='camps-background'></div>
      </div>
    </Parallax>
  );
};

export default CampsComponent;
