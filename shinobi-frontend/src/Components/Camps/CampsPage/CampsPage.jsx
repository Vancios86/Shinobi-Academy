import './CampsPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CampsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
  return (
    <div className='camps-page container'>
      <div className='welcome-logo flex'>
        <Logo />
      </div>
      <button
        className='back-button flex'
        onClick={() => {
          navigate(-1);
        }}
      >
        <b>↞</b>
      </button>
      <div className='camps-page-wrapper'>
        <div className='page-title'>
          <h3>Camps</h3>
        </div>
        <div className='camps-page-content'>
          <div className='container flow'>
            <p>
              The Dojo is available for training camps for teams and clubs. The
              strength and conditioning room is also available for small groups.
              We also run our own training camps and we have guests and coaches
              from all over the world throughout the year. Down below you can
              find captures from some of the training camps we have run in the
              past.
            </p>
          </div>
          <div className='camps-container flow flex'>
            <hr />
            <section className='section1'>
              <h2 className='camp-title flex'>Team Ryano</h2>
              <div style={{ padding: '75% 0 0 0', position: 'relative' }}>
                <iframe
                  src='https://player.vimeo.com/video/748805260?h=c8016ae329&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                  frameBorder='0'
                  allow='autoplay; fullscreen; picture-in-picture'
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                  }}
                  title='Team Ryano'
                ></iframe>
              </div>
              <script src='https://player.vimeo.com/api/player.js'></script>
              <p className='camp-description'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae cum, eum assumenda blanditiis voluptas voluptate
                dolorem ut rem nemo, quisquam illum placeat impedit totam
                voluptatum a non debitis ad sequi fuga?
              </p>
            </section>
            <section className='section2'>
              <h2 className='camp-title flex'>Silverback Jiujitsu</h2>
              <p className='camp-description'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae cum, eum assumenda blanditiis voluptas voluptate
                dolorem ut rem nemo, quisquam illum placeat impedit totam
                voluptatum a non debitis ad sequi fuga?
              </p>
            </section>
            <section className='section3'>
              <h2 className='camp-title flex'>Holohan Martial Arts</h2>
              <p className='camp-description'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae cum, eum assumenda blanditiis voluptas voluptate
                dolorem ut rem nemo, quisquam illum placeat impedit totam
                voluptatum a non debitis ad sequi fuga?
              </p>
            </section>
            <section className='section4'>
              <h2 className='camp-title flex'>Team MMA</h2>
              <p className='camp-description'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae cum, eum assumenda blanditiis voluptas voluptate
                dolorem ut rem nemo, quisquam illum placeat impedit totam
                voluptatum a non debitis ad sequi fuga?
              </p>
            </section>
            <hr />
          </div>
          <p>
            For any information you might need regarding our camps please
            contact us using your favourite method of <a href='#'>contact</a>
          </p>
        </div>
      </div>

      <div className='secondary-page-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default CampsPage;
