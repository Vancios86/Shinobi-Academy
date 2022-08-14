import './Main.css';

import { useEffect } from 'react';
import { ParallaxProvider } from 'react-scroll-parallax';
import TopPage from './Components/TopPage/TopPage';
import AboutPage from './Components/AboutPage/AboutPage';
import ClassesPage from './Components/ClassesPage/ClassesPage';
import CampsComponent from './Components/Camps/CampsComponent/CampsComponent';
import GalleryComponent from './Components/Gallery/GalleryComponent/GalleryComponent';
import ContactPage from './Components/Contact/ContactPage';
import Footer from './Components/Footer/Footer';

const Main = () => {
  useEffect(() => {
    var link = document.querySelector('.go-to-top-button');

    window.addEventListener('scroll', (e) => {
      window.pageYOffset > 1100
        ? link.classList.add('show')
        : (link.className = 'go-to-top-button');
    });
  });

  return (
    <div className="main grid container">
      <ParallaxProvider>
        <TopPage />
        <AboutPage />
        <ClassesPage />
        <div className="inline-components-section">
          <CampsComponent />
          <GalleryComponent />
        </div>
        <ContactPage />
        <Footer />
      </ParallaxProvider>
      <button className="go-to-top-button">
        <a href="#nav-container" id="back-to-top-link">
          <b>↟</b>
        </a>
      </button>
    </div>
  );
};

export default Main;
