import './ContactComponent.css';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';
import { MdPhone, MdEmail, MdLocationPin } from 'react-icons/md';
import { IconContext } from 'react-icons';

const ContactComponent = () => {
  return (
    <ParallaxProvider>
      <Parallax speed={16}>
        <div className='contact-component preview-component container flow'>
          <div className='component-title'>
            <h3 id='contact-component-title'>Contact</h3>
          </div>

          <IconContext.Provider
            value={{
              color: 'hsl(var(--clr-red))',
              className: 'global-class-name',
            }}
          >
            <div className='contact-items-list container flex text-light'>
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
                  <MdLocationPin /> Iberlagos Rua Don Jose nr15
                </li>
              </ul>
            </div>
          </IconContext.Provider>

          <div className='component-button flex'>
            <button className='button-large'>contact us</button>
          </div>

          <div className='contact-background'></div>
        </div>
      </Parallax>
    </ParallaxProvider>
  );
};

export default ContactComponent;
