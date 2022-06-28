import './Footer.css';
import { MdPhone, MdEmail, MdLocationPin } from 'react-icons/md';
import { SiTwitter, SiYoutube } from 'react-icons/si';
import { AiFillInstagram } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import vector from '../Logo/vector.jpeg';
import Tilt from 'react-parallax-tilt';

const Footer = () => {
  return (
    <div className='footer container grid bg-light text-dark'>
      <div className='section footer-top'>
        <div className='logo-footer'>
          <Tilt>
            <img src={vector} alt='vector-logo' />
          </Tilt>
        </div>

        <IconContext.Provider
          value={{
            color: 'hsl(var(--clr-red))',
            className: 'global-class-name',
          }}
        >
          <div className='contact flex'>
            <ul>
              <li>
                <span>
                  <MdPhone />
                </span>{' '}
                977 777 777
              </li>
              <li>
                <MdEmail /> shinobyacademy@gmail.com
              </li>
              <li>
                <MdLocationPin /> Rua xxxxx nr15
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
                <AiFillInstagram />
              </li>
              <li>
                <SiTwitter />
              </li>
              <li>
                <SiYoutube />
              </li>
            </ul>
          </div>
        </div>
      </IconContext.Provider>
    </div>
  );
};

export default Footer;
