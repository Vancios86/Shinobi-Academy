import './Main.css';

import Footer from './Components/Footer/Footer';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import AboutPage from './Components/AboutPage/AboutPage';
import ClassesPage from './Components/ClassesPage/ClassesPage';
import { Routes, Route } from 'react-router-dom';

const Main = () => {
  return (
    <div className='main grid'>
      {/* <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/#about-page' element={<AboutPage />} />
      </Routes> */}
      <WelcomePage />
      <AboutPage />
      <ClassesPage />
      <Footer />
    </div>
  );
};

export default Main;
