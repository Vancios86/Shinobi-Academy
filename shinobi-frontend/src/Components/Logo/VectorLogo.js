import Tilt from 'react-parallax-tilt';
import './VectorLogo.css';
import Vector from './vector.jpeg';

const VectorLogo = () => {
  return (
    <Tilt>
      <div className='Vector'>
        <img src={Vector} loading='lazy' alt='logo head' />
      </div>
    </Tilt>
  );
};

export default VectorLogo;
