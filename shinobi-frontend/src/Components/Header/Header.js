import VectorLogo from '../Logo/VectorLogo';
import Navigation from '../Navigation/Navigation';
import './Header.css';

const Header = () => {
  return (
    <div className='header'>
      <VectorLogo />

      <Navigation />
    </div>
  );
};

export default Header;
