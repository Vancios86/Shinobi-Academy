import './CampsComponent.css';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

const CampsComponent = () => {
  return (
    <ParallaxProvider>
      <Parallax speed={16}>
        <div className='preview-component container flow'>
          <div className='component-title'>
            <h3 id='camps-component-title'>Camps</h3>
          </div>
          <div className='container flex'>
            <p className='text-content text-light' id='camps-component-text'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni
              eligendi perspiciatis est nisi iusto voluptas minima aliquid
              repellat tempora. Perferendis quos repellat praesentium magni
              atque repudiandae quod, dolorem id consectetur modi tenetur
              inventore!
            </p>
          </div>
          <div className='container-button flex'>
            <button className='button-large'>view details</button>
          </div>
          <div className='camps-background'></div>
        </div>
      </Parallax>
    </ParallaxProvider>
  );
};

export default CampsComponent;
