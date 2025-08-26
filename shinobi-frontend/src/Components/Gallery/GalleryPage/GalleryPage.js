
import './GalleryPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import ModernGalleryComponent from '../GalleryComponent/ModernGalleryComponent';

const GalleryPage = () => {
  const navigate = useNavigate();

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
      
      <div className='gallery-page-content'>
        <ModernGalleryComponent />
      </div>
      
      <div className='secondary-page-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default GalleryPage;
