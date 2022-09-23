import { useState, useEffect } from 'react';
import './GalleryComponent.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';
import prev1 from '../../../assets/gallery-assets/gallery-preview-images/prev1.webp';
import prev2 from '../../../assets/gallery-assets/gallery-preview-images/prev2.webp';
import prev3 from '../../../assets/gallery-assets/gallery-preview-images/prev3.webp';
import prev4 from '../../../assets/gallery-assets/gallery-preview-images/prev4.webp';

const GalleryComponent = () => {
  const [imgSrc, setImgSrc] = useState(prev1);
  //change the background image every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (imgSrc === prev1) {
        setImgSrc(prev2);
      } else if (imgSrc === prev2) {
        setImgSrc(prev3);
      } else if (imgSrc === prev3) {
        setImgSrc(prev4);
      } else if (imgSrc === prev4) {
        setImgSrc(prev1);
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [imgSrc]);

  console.log(imgSrc);

  return (
    <Parallax opacity={[3, 0]}>
      <div className='gallery-component preview-component container flow'>
        <div className='component-title'>
          <h3 id='gallery-component-title'>Media Gallery</h3>
        </div>
        <div className='container flex'>
          <p className='text-content text-white' id='gallery-component-text'>
            We gathered some photos from over the years and put them together in
            a gallery. Enjoy!
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
            backgroundImage: `url(${imgSrc})`,
          }}
        ></div>
      </div>
    </Parallax>
  );
};

export default GalleryComponent;
