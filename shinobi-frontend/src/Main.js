import './Main.css';

import Footer from './Components/Footer/Footer';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import AboutPage from './Components/AboutPage/AboutPage';
import ClassesPage from './Components/ClassesPage/ClassesPage';
import CampsComponent from './Components/Camps/CampsComponent/CampsComponent';
import GalleryComponent from './Components/Gallery/GalleryComponent/GalleryComponent';
import ContactPage from './Components/Contact/ContactPage';
import { ParallaxProvider } from 'react-scroll-parallax';

const Main = () => {
  return (
    <div className='main grid container'>
      <ParallaxProvider>
        <WelcomePage />
        <AboutPage />
        <ClassesPage />
        <div className='inline-components-section'>
          <CampsComponent />
          <GalleryComponent />
        </div>
        <ContactPage />
        <Footer />
      </ParallaxProvider>
    </div>
  );
};

export default Main;
