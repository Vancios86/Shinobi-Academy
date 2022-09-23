import { useState } from 'react';
import './GalleryPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { galleryImages } from '../../../assets/gallery-assets/gallery-assets';
import { AiOutlineClose } from 'react-icons/ai';
import { AiOutlineRight } from 'react-icons/ai';
import { AiOutlineLeft } from 'react-icons/ai';

const GalleryPage = () => {
  const [modal, setModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const getImage = (imageSrc, imageId) => {
    setTempImage(imageSrc, imageId);
    setModal(true);
  };

  const getPrevPhoto = ([galleryImages], imageSrc) => {
    let imgObj = galleryImages.find((image) => image.src === imageSrc);
    let prevImgObj =
      imgObj.id > 1
        ? galleryImages[galleryImages.indexOf(imgObj) - 1].src
        : galleryImages[galleryImages.length - 1].src;
    setTempImage(prevImgObj);
  };

  const getNextPhoto = ([galleryImages], imageSrc) => {
    let imgObj = galleryImages.find((image) => image.src === imageSrc);
    let nextImgObj =
      imgObj.id < galleryImages.length
        ? galleryImages[galleryImages.indexOf(imgObj) + 1].src
        : galleryImages[0].src;
    setTempImage(nextImgObj);
  };

  return (
    <div className='gallery-page container'>
      <div className='welcome-logo flex'>
        <Logo />
      </div>
      <button
        className='back-button flex'
        onClick={() => {
          navigate(-1);
        }}
      >
        <b>↞</b>
      </button>
      <div className={modal ? 'modal open' : 'modal'}>
        <img src={tempImage} loading='lazy' alt='' />
        <AiOutlineClose
          onClick={() => setModal(false)}
          className='close-modal'
        />
        <AiOutlineLeft
          className='swap-left'
          onClick={() => getPrevPhoto([galleryImages], tempImage)}
        />
        <AiOutlineRight
          className='swap-right'
          onClick={() => getNextPhoto([galleryImages], tempImage)}
        />
      </div>
      <div className='gallery-page-content'>
        <div className='page-title'>
          <h3>Media Gallery</h3>
        </div>
        <div className='gallery-container flow'>
          {galleryImages.map((image) => (
            <div
              className='gallery-item'
              key={image.id}
              onClick={() => getImage(image.src, image.id)}
            >
              <img src={image.src} loading='lazy' alt={image.title} />
            </div>
          ))}
        </div>
      </div>
      <div className='secondary-page-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default GalleryPage;
