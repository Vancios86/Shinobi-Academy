import { useState, useEffect } from 'react';
import './GalleryComponent.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';
import { images2 } from '../../../assets/gallery-assets/gallery-assets';

const GalleryComponent = () => {
  const [imgStr, setImgStr] = useState(images2[0].src);
  //change the background image every 5 seconds
  useEffect(() => {
    let index = 0;
    setInterval(() => {
      index += 1;
      if (index === images2.length - 1) {
        index = 0;
      }
      setImgStr(images2[index].src);
    }, 7000);
  }, []);

  return (
    <Parallax speed={16} opacity={[3, 0]}>
      <div className='gallery-component preview-component container flow'>
        <div className='component-title'>
          <h3 id='gallery-component-title'>Media Gallery</h3>
        </div>
        <div className='container flex'>
          <p className='text-content text-white' id='gallery-component-text'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni
            eligendi perspiciatis est nisi iusto voluptas minima aliquid
            repellat tempora. Perferendis quos repellat praesentium magni atque
            repudiandae quod, dolorem id consectetur modi tenetur inventore!
          </p>
        </div>
        <div className='component-button flex'>
          <button className='button-large'>
            <Link to='/gallery'>Visit gallery</Link>
          </button>
        </div>
        <div
          className='gallery-background'
          style={{
            backgroundImage: `url(${imgStr})`,
          }}
        ></div>
      </div>
    </Parallax>
  );
};

export default GalleryComponent;
