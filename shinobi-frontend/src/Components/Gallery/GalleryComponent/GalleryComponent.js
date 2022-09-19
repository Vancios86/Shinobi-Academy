import { useState, useEffect } from 'react';
import './GalleryComponent.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';
import { galleryPreviewImages } from '../../../assets/gallery-assets/gallery-assets';

const GalleryComponent = () => {
  const [imgStr, setImgStr] = useState(galleryPreviewImages[0].src);
  //change the background image every 5 seconds
  useEffect(() => {
    let index = 1;
    setInterval(() => {
      index += 1;
      if (index === galleryPreviewImages.length) {
        index = 0;
      }
      setImgStr(galleryPreviewImages[index].src);
    }, 5000);
  }, []);

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
            backgroundImage: `url(${imgStr})`,
          }}
        ></div>
      </div>
    </Parallax>
  );
};

export default GalleryComponent;
