import './Footer.css';
import { MdPhone, MdEmail, MdLocationPin } from 'react-icons/md';
import { SiInstagram, SiTwitter, SiYoutube } from 'react-icons/si';
import { IconContext } from 'react-icons';

const Footer = () => {
  return (
    <div className='footer container flex bg-light text-dark fs300'>
      <IconContext.Provider
        value={{ color: 'hsl(var(--clr-red))', className: 'global-class-name' }}
      >
        <div className='contact flex'>
          <ul>
            <li>
              <span>
                <MdPhone />
              </span>{' '}
              077777777
            </li>
            <li>
              <MdEmail /> colinbyrne@mail.com
            </li>
            <li>
              <MdLocationPin /> Rua xxxxx nr15
            </li>
          </ul>
        </div>
      </IconContext.Provider>

      <div className='contact-form flex'>
        <form action=''>
          <input type='text' name='name' id='name' placeholder='your name' />
          <br />
          <input type='text' name='email' id='email' placeholder='email' />
          <br />
          <input
            type='button'
            name='send-message'
            id='send-message'
            value='send'
          />
        </form>
      </div>

      <IconContext.Provider
        value={{
          color: 'hsl(var(--clr-red))',
          size: '2em',
          className: 'social-media-icons',
        }}
      >
        <div className='social-media clr-red'>
          <ul className='flex'>
            <li>
              <SiInstagram />
            </li>
            <li>
              <SiTwitter />
            </li>
            <li>
              <SiYoutube />
            </li>
          </ul>
        </div>
      </IconContext.Provider>
    </div>
  );
};

export default Footer;
