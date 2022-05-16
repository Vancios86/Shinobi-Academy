import './Main.css';
import Logo from './Components/Logo/Logo';
import Footer from './Components/Footer/Footer';
import Welcome from './Components/Welcome/Welcome';

const Main = () => {
  return (
    <>
      <div className='main container flex'>
        
        <Logo />

       <Welcome />

        <Footer />

      </div>
    </>
  );
};

export default Main;
