import './Main.css';

import Footer from './Components/Footer/Footer';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import AboutPage from './Components/AboutPage/AboutPage';
import ClassesPage from './Components/ClassesPage/ClassesPage';
import CampsComponent from './Components/CampsComponent/CampsComponent';
import GalleryComponent from './Components/Gallery/GalleryComponent';
import ContactPage from './Components/Contact/ContactPage';
// import { Routes, Route } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';

const Main = () => {
  return (
    <div className='main grid container'>
      <ParallaxProvider>
        {/* <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/#about-page' element={<AboutPage />} />
      </Routes> */}
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
