import './CampsPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CampsPage = () => {
  const [enteringCampsPage, setEnteringCampsPage] = useState(false);
  const navigate = useNavigate();

  console.log(enteringCampsPage);

  useEffect(() => {
    setEnteringCampsPage(true);
    if (enteringCampsPage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [enteringCampsPage]);

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
              from all over the world throughout the year. Below you can find
              captures from some of the training camps we have run in the past.
            </p>
          </div>

          <div className='camps-container flow'>
            <section className='section1 camp-section shadowed-box'>
              <h2 className='camp-title flex'>Team Ryano</h2>
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                <iframe
                  src='https://player.vimeo.com/video/755202131?h=b12193bd19&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                  frameBorder='0'
                  allow='autoplay; fullscreen; picture-in-picture'
                  allowFullScreen
                  loading='lazy'
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
            </section>

            <section className='section2 camp-section shadowed-box'>
              <h2 className='camp-title flex'>Silverback Jiujitsu</h2>
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                <iframe
                  src='https://player.vimeo.com/video/755202930?h=d537e645c5&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                  frameBorder='0'
                  allow='autoplay; fullscreen; picture-in-picture'
                  allowFullScreen
                  loading='lazy'
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                  }}
                  title='Silverback.mp4'
                ></iframe>
              </div>
            </section>

            <section className='section3 camp-section shadowed-box'>
              <h2 className='camp-title flex'>Mark Roper</h2>
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                <iframe
                  src='https://player.vimeo.com/video/752482165?h=2b609f21c0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                  frameBorder='0'
                  allow='autoplay; fullscreen; picture-in-picture'
                  allowFullScreen
                  loading='lazy'
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                  }}
                  title='MarkRoper.mp4'
                ></iframe>
              </div>
            </section>

            <section className='section4 camp-section shadowed-box'>
              <h2 className='camp-title flex'>Irish Strength Institute</h2>
              <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                <iframe
                  src='https://player.vimeo.com/video/755204264?h=c33611bc76&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479'
                  frameBorder='0'
                  allow='autoplay; fullscreen; picture-in-picture'
                  allowFullScreen
                  loading='lazy'
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                  }}
                  title='ISI.mp4'
                ></iframe>
              </div>
              <script src='https://player.vimeo.com/api/player.js'></script>
            </section>
          </div>
          <p className='flex' style={{ padding: '3rem 0 3rem 0' }}>
            For any information you might need regarding our camps please
            contact us!
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
