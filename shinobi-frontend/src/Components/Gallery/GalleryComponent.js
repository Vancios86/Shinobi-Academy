import './GalleryComponent.css';
import { Parallax } from 'react-scroll-parallax';

const GalleryComponent = () => {
  return (
    <Parallax speed={16}>
      <div className='gallery-component preview-component container flow'>
        <div className='component-title'>
          <h3 id='gallery-component-title'>Media Gallery</h3>
        </div>
        <div className='container flex'>
          <p className='text-content text-light' id='gallery-component-text'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni
            eligendi perspiciatis est nisi iusto voluptas minima aliquid
            repellat tempora. Perferendis quos repellat praesentium magni atque
            repudiandae quod, dolorem id consectetur modi tenetur inventore!
          </p>
        </div>
        <div className='component-button flex'>
          <button className='button-large'>visit gallery</button>
        </div>
        <div className='gallery-background'></div>
      </div>
    </Parallax>
  );
};

export default GalleryComponent;
