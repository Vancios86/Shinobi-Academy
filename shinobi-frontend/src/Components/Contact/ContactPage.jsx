import './ContactPage.css';
import ContactFormComponent from './ContactFormComponent/ContactFormComponent';
import MapComponent from './MapComponent/MapComponent';
import { MdPhone, MdEmail, MdLocationPin } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { SiFacebook, SiYoutube } from 'react-icons/si';
import { AiFillInstagram } from 'react-icons/ai';

const ContactPage = () => {
  return (
    <div className='contact-page container flex'>
      <div className='page-title' id='contact'>
        <h3>Contact</h3>
      </div>

      <div className='inline-elements inline-elements-top'>
        <IconContext.Provider
          value={{
            color: 'hsl(var(--clr-red))',
            size: '2.25em',
            className: 'social-media-icons',
          }}
        >
          <div className='social-media-container shadowed-box flex clr-red'>
            <div className='social-media '>
              <ul className='flex'>
                <li className='sm-item'>
                  <AiFillInstagram
                    onClick={() =>
                      window.open('https://instagram.com/shinobiacademylagos')
                    }
                  />
                </li>
                <li className='sm-item'>
                  <SiYoutube
                    onClick={() =>
                      window.open('https://www.youtube.com/c/ShinobiVlog')
                    }
                  />
                </li>
                <li className='sm-item'>
                  <SiFacebook
                    onClick={() => window.open('https://www.facebook.com/')}
                  />
                </li>
              </ul>
            </div>
          </div>
        </IconContext.Provider>

        <IconContext.Provider
          value={{
            color: 'hsl(var(--clr-red))',
            className: 'global-class-name',
            size: '21px',
            margin: '0, 0, -5px, 0',
          }}
        >
          <div className='contact-list-container flex'>
            <div className='contact-list flex'>
              <ul className='shadowed-box contact-list-items flex'>
                <li>
                  <MdPhone /> 977 777 777
                </li>
                <li>
                  <a
                    href='mailto:shinobiacademy@gmail.com?&subject=From Shinobi Academy website'
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <MdEmail /> Send us an Email
                  </a>
                </li>
                <li>
                  <MdLocationPin /> R.Convento da Trindade 15, 8600-613 Lagos
                </li>
              </ul>
            </div>
          </div>
        </IconContext.Provider>
      </div>

      <div className='inline-elements inline-elements-bottom'>
        <MapComponent />
        <ContactFormComponent />
      </div>
    </div>
  );
};

export default ContactPage;
