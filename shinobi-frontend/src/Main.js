import './Main.css';

import Footer from './Components/Footer/Footer';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import AboutPage from './Components/AboutPage/AboutPage';
import ClassesPage from './Components/ClassesPage/ClassesPage';
import CampsComponent from './Components/CampsComponent/CampsComponent';
import ContactComponent from './Components/Contact/ContactComponent';
import { Routes, Route } from 'react-router-dom';

const Main = () => {
  return (
    <div className='main grid container'>
      {/* <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/#about-page' element={<AboutPage />} />
      </Routes> */}
      <WelcomePage />
      <AboutPage />
      <ClassesPage />
      <div className='components-section'>
        <CampsComponent />
        <ContactComponent />
      </div>
      <Footer />
    </div>
  );
};

export default Main;
