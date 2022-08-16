import { useState } from 'react';
import './GalleryPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { images } from '../../../assets/gallery-assets/gallery-assets';
import { AiOutlineClose } from 'react-icons/ai';
import { AiOutlineRight } from 'react-icons/ai';
import { AiOutlineLeft } from 'react-icons/ai';

const GalleryPage = () => {
  const [modal, setModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  const getImage = (imageSrc, imageId) => {
    setTempImage(imageSrc, imageId);
    setModal(true);
  };

  const getPrevPhoto = ([images], imageSrc) => {
    let imgObj = images.find((image) => image.src === imageSrc);
    let prevImgObj =
      imgObj.id > 1
        ? images[images.indexOf(imgObj) - 1].src
        : images[images.length - 1].src;
    setTempImage(prevImgObj);
  };

  const getNextPhoto = ([images], imageSrc) => {
    let imgObj = images.find((image) => image.src === imageSrc);
    let nextImgObj =
      imgObj.id < images.length
        ? images[images.indexOf(imgObj) + 1].src
        : images[0].src;
    setTempImage(nextImgObj);
  };

  const navigate = useNavigate();
  useEffect(() => {
    console.log(
      'X position :',
      window.scrollX,
      ' |Y position: ',
      window.scrollY
    );
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
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
          onClick={() => getPrevPhoto([images], tempImage)}
        />
        <AiOutlineRight
          className='swap-right'
          onClick={() => getNextPhoto([images], tempImage)}
        />
      </div>
      <div className='gallery-page-content'>
        <div className='page-title'>
          <h3>Media Gallery</h3>
        </div>
        <div className='gallery-container flow'>
          {images.map((image) => (
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
