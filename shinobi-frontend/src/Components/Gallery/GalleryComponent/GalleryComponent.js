import { useState, useEffect } from 'react';
import './GalleryComponent.css';
import { Parallax } from 'react-scroll-parallax';
import { Link } from 'react-router-dom';
import { useGallery } from '../../../contexts/GalleryContext';

const GalleryComponent = () => {
  const { galleryData, isLoaded } = useGallery();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Change the background image every 7 seconds using gallery images
  useEffect(() => {
    if (!isLoaded || galleryData.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % galleryData.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [isLoaded, galleryData.length]);
  
  // Get current image source
  const currentImage = galleryData[currentImageIndex];
  const imgSrc = currentImage ? 
    (currentImage.src.startsWith('http') ? currentImage.src : `http://localhost:5001${currentImage.src}`) : 
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdhbGxlcnkgSW1hZ2VzPC90ZXh0Pjwvc3ZnPg==';

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
