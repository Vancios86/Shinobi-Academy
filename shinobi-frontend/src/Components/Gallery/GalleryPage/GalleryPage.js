import './GalleryPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const GalleryPage = () => {
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
        className='flex'
        id='back-button'
        onClick={() => {
          navigate(-1);
        }}
      >
        <b>↞</b>
      </button>
      <div className='gallery-page-content'>
        <div className='page-title'>
          <h3>Media Gallery</h3>
        </div>
        <div className='schedule-container flow flex'>
          <h3>Here we'll load the media files for the gallery</h3>
        </div>
      </div>
      <div className='secondary-page-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default GalleryPage;
