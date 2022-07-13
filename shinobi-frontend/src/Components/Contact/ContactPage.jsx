import './ContactPage.css';
import ContactFormComponent from './ContactFormComponent/ContactFormComponent';
// import MapComponent from './MapComponent/MapComponent';
import MyMap from './MapComponent/Map';
import { Parallax } from 'react-scroll-parallax';
import { MdPhone, MdEmail, MdLocationPin } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { SiTwitter, SiYoutube } from 'react-icons/si';
import { AiFillInstagram } from 'react-icons/ai';

const ContactPage = () => {
  return (
    <Parallax speed={3}>
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
                    <AiFillInstagram />
                  </li>
                  <li className='sm-item'>
                    <SiTwitter />
                  </li>
                  <li className='sm-item'>
                    <SiYoutube />
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
            }}
          >
            <div className='contact-list-container flex'>
              <div className='contact-list flex'>
                <ul className='shadowed-box contact-list-items flex'>
                  <li>
                    <MdPhone /> 977 777 777
                  </li>
                  <li>
                    <MdEmail /> shinobyacademy@gmail.com
                  </li>
                  <li>
                    <MdLocationPin /> Iberlagos Rua Don Jose nr15
                  </li>
                </ul>
              </div>
            </div>
          </IconContext.Provider>
        </div>

        <div className='inline-elements inline-elements-bottom'>
          {/* <MapComponent /> */}
          <MyMap />

          <ContactFormComponent />
        </div>
      </div>
    </Parallax>
  );
};

export default ContactPage;
