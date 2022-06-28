import './GalleryPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';

const GalleryPage = () => {
  return (
    <div className='gallery-page container'>
      <div className='welcome-logo flex'>
        <Logo />
      </div>
      <div className='gallery-page-content'>
        <div className='page-title'>
          <h3>Media Gallery</h3>
        </div>
        <div className='gallery-container container flow'></div>
      </div>
      <div className='secondary-page-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default GalleryPage;
