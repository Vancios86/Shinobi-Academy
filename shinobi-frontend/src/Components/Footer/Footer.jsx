import './Footer.css';
import { MdPhone, MdEmail, MdLocationPin } from 'react-icons/md';
import { SiFacebook, SiYoutube } from 'react-icons/si';
import { AiFillInstagram } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import logoMask from '../../assets/logos/logo-mask.png';
import Tilt from 'react-parallax-tilt';
import { useContact } from '../../contexts/ContactContext';

const Footer = () => {
  const { contactData, isLoaded } = useContact();
  const phone = contactData?.phone || '';
  const email = contactData?.email || '';
  const address = contactData?.address || {};
  const social = contactData?.socialMedia || {};

  if (!isLoaded) {
    return (
      <div className='footer container grid text-dark'>
              <div className='section footer-top'>
        <p>Loading contact information...</p>
      </div>
      </div>
    );
  }

  return (
    <div className='footer container grid text-dark'>
              <div className='section footer-top'>
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
                <a href={`tel:${phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}?&subject=From Shinobi Academy website`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <MdEmail /> {email}
                </a>
              </li>
              <li>
                <MdLocationPin /> {address.street || ''}
                <br /> &emsp;{address.postalCode || ''} {address.city || ''}
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
              <li
                tabIndex="0"
                role="button"
                onClick={() => social.instagram?.url && window.open(social.instagram.url)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    social.instagram?.url && window.open(social.instagram.url);
                  }
                }}
                aria-label={`Follow us on Instagram: ${social.instagram?.display || ''}`}
              >
                <AiFillInstagram
                  title={`Follow us on Instagram: ${social.instagram?.display || ''}`}
                />
              </li>
              <li
                tabIndex="0"
                role="button"
                onClick={() => social.facebook?.url && window.open(social.facebook.url)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    social.facebook?.url && window.open(social.facebook.url);
                  }
                }}
                aria-label={`Follow us on Facebook: ${social.facebook?.display || ''}`}
              >
                <SiFacebook
                  title={`Follow us on Facebook: ${social.facebook?.display || ''}`}
                />
              </li>
              <li
                tabIndex="0"
                role="button"
                onClick={() => social.youtube?.url && window.open(social.youtube.url)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    social.youtube?.url && window.open(social.youtube.url);
                  }
                }}
                aria-label={`Subscribe to our YouTube: ${social.youtube?.display || ''}`}
              >
                <SiYoutube
                  title={`Subscribe to our YouTube: ${social.youtube?.display || ''}`}
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
