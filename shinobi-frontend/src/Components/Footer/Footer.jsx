import './Footer.css';
import { MdPhone, MdEmail, MdLocationPin } from 'react-icons/md';
import { SiFacebook, SiYoutube } from 'react-icons/si';
import { AiFillInstagram } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import logoMask from '../../assets/logos/logo-mask.png';
import Tilt from 'react-parallax-tilt';

const Footer = () => {
  return (
    <div className='footer container grid text-dark'>
      <div className='section footer-top shadowed-box'>
        <div className='logo-footer'>
          <Tilt>
            <img src={logoMask} loading='lazy' alt='vector-logo' />
          </Tilt>
        </div>

        <h3 className='text-gold flex'>We are all one!</h3>

        <IconContext.Provider
          value={{
            color: 'hsl(var(--clr-red))',
            className: 'global-class-name',
          }}
        >
          <div className='contact flex'>
            <ul className='footer-contact-list'>
              <li>
                <span>
                  <MdPhone />
                </span>{' '}
                (+351) 977 777 777
              </li>
              <li>
                <a
                  href='mailto:shinobiacademy@gmail.com?&subject=From Shinobi Academy website'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <MdEmail /> shinobiacademy@gmail.com
                </a>
              </li>
              <li>
                <MdLocationPin /> R.Convento da Trindade 15
                <br /> &emsp;8600-613 Lagos
              </li>
            </ul>
          </div>
        </IconContext.Provider>
      </div>

      <IconContext.Provider
        value={{
          color: 'hsl(var(--clr-red))',
          size: '2.25em',
          className: 'social-media-icons',
        }}
      >
        <div className='section footer-bottom'>
          <div className='social-media clr-red'>
            <ul className='flex'>
              <li>
                <AiFillInstagram
                  onClick={() =>
                    window.open('https://instagram.com/shinobiacademylagos')
                  }
                />
              </li>
              <li>
                <SiFacebook
                  onClick={() => window.open('https://www.facebook.com/')}
                />
              </li>
              <li>
                <SiYoutube
                  onClick={() =>
                    window.open('https://www.youtube.com/c/ShinobiVlog')
                  }
                />
              </li>
            </ul>
          </div>
        </div>
      </IconContext.Provider>
    </div>
  );
};

export default Footer;
