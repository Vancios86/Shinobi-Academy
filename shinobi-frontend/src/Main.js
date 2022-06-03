import './Main.css';

import Footer from './Components/Footer/Footer';
import Welcome from './Components/WelcomePage/Welcome';
import About from './Components/Pages/About/About';
import { Routes, Route } from 'react-router-dom';

const Main = () => {
  return (
    <div className='main grid'>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/About' element={<About />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default Main;
