import './Main.css';
import Logo from './Components/Logo/Logo';
import Footer from './Components/Footer/Footer';
import Welcome from './Components/WelcomePage/Welcome';

const Main = () => {
  return (
    <>
      <div className='main flex'>
        <Logo />

        <Welcome />

        <Footer />
      </div>
    </>
  );
};

export default Main;
