import { useState, useEffect } from 'react';
import './GalleryPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { galleryImages } from '../../../assets/gallery-assets/gallery-assets';
import { AiOutlineClose } from 'react-icons/ai';
import { AiOutlineRight } from 'react-icons/ai';
import { AiOutlineLeft } from 'react-icons/ai';

const GalleryPage = () => {
  const [modal, setModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [enteringGalleryPage, setEnteringGalleryPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEnteringGalleryPage(true);
    if (enteringGalleryPage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [enteringGalleryPage]);

  // use interesection observer to load images as they come into view
  useEffect(() => {
    setTimeout(() => {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            image.onload = () => {
              image.classList.add('loaded');
            };
            observer.unobserve(image);
          }
        });
      }, options);

      const images = document.querySelectorAll('.gallery-image');
      images.forEach((image) => observer.observe(image));
    }, 333);
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
        <img src={tempImage} alt='' />
        <AiOutlineClose
          onClick={() => setModal(false)}
          className='close-modal'
        />
        <AiOutlineLeft
          className='swipe-left'
          onClick={() => getPrevPhoto([galleryImages], tempImage)}
        />
        <AiOutlineRight
          className='swipe-right'
          onClick={() => getNextPhoto([galleryImages], tempImage)}
        />
      </div>
      <div className='gallery-page-content'>
        <div className='page-title'>
          <h3>Media Gallery</h3>
        </div>

        <div className='images-container flow shadowed-box'>
          {galleryImages.map((image) => (
            <img
              key={image.id}
              className='gallery-image'
              src={''}
              data-src={image.src}
              alt=''
              onClick={() => getImage(image.src, image.id)}
            />
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
