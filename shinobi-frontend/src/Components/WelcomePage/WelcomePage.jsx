import './WelcomePage.css';
import Logo from '../Logo/Logo';
import ShinobiVideo from './SHINOBI.mp4';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="welcome-page">
      <Logo />
      <div className="presentation-text">
        <h1>MMA</h1>
        <h1>Box</h1>
        <h1>Muay-Thai</h1>
        <h1>Kick-Box</h1>
        <h1>JiuJitsu</h1>
        <h1>Wrestling</h1>
        <h1>Grappling</h1>
        <h1>Ninjutsu</h1>
        <h1>Strength&amp;Conditioning</h1>
        <h1>Private Classes</h1>
      </div>
      <video
        width={'100%'}
        autoPlay
        loop
        muted
        playsInline
        loading="lazy"
        className="welcome-video"
      >
        <source src={ShinobiVideo} type="video/mp4" />
      </video>
      <div className="flex">
        <button
          className="button-large enter-button"
          onClick={() => navigate('/home')}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
