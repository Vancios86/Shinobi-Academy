
import './GalleryPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ModernGalleryComponent from '../GalleryComponent/ModernGalleryComponent';

const GalleryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top when component mounts or route changes
  useEffect(() => {
    // Use a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when the pathname changes

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
