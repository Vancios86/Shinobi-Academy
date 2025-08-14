import './ContactPage.css';
import ContactFormComponent from './ContactFormComponent/ContactFormComponent';
import MapComponent from './MapComponent/MapComponent';
import { MdPhone, MdEmail, MdLocationPin } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { SiFacebook, SiYoutube } from 'react-icons/si';
import { AiFillInstagram } from 'react-icons/ai';
import { useContact } from '../../contexts/ContactContext';

const ContactPage = () => {
  const { contactData, isLoaded } = useContact();

  if (!isLoaded) {
    return (
      <div className='contact-page container flex'>
        <div className='page-title' id='contact'>
          <h3>Contact</h3>
        </div>
        <div className='inline-elements inline-elements-top'>
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }

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
                    onClick={() => window.open(contactData.socialMedia.instagram.url)}
                    title={`Follow us on Instagram: ${contactData.socialMedia.instagram.display}`}
                  />
                </li>
                <li className='sm-item'>
                  <SiYoutube
                    onClick={() => window.open(contactData.socialMedia.youtube.url)}
                    title={`Subscribe to our YouTube: ${contactData.socialMedia.youtube.display}`}
                  />
                </li>
                <li className='sm-item'>
                  <SiFacebook
                    onClick={() => window.open(contactData.socialMedia.facebook.url)}
                    title={`Follow us on Facebook: ${contactData.socialMedia.facebook.display}`}
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
                  <MdPhone /> 
                  <a href={`tel:${contactData.phone.value}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {contactData.phone.display}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contactData.email.value}?&subject=From Shinobi Academy website`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <MdEmail /> Send us an Email
                  </a>
                </li>
                <li>
                  <MdLocationPin /> {contactData.address.full}
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
