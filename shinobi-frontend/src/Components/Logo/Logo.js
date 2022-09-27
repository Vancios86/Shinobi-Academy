import logo from '../../assets/logos/logo.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className='logo'>
      <img src={logo} alt='main logo' />
    </div>
  );
};

export default Logo;
