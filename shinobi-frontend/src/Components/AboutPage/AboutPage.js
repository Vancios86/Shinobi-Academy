// import Header from '../Header/Header';

import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className='about-page grid'>
      <div className='about-page-content'>
        <section className='container flow'>
          <div className='page-title' id='about-page'>
            <h3>About us</h3>
          </div>
          <div className='photo-colin'></div>
          <p className='fs-200 text-dark about-text'>
            This is Colin Byrne, the founder of Shinobi Academy. Labore
            consequuntur officia adipisci, dolorum et dolorem neque explicabo
            aut nostrum rem atque. Doloremque maxime quibusdam, recusandae
            voluptatem error quisquam ducimus obcaecati. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Labore consequuntur officia
            adipisci, dolorum et dolorem neque explicabo aut nostrum rem atque.
            Doloremque maxime quibusdam, recusandae voluptatem error quisquam
            ducimus obcaecati. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Labore consequuntur officia adipisci, dolorum et
            dolorem neque explicabo aut nostrum rem atque. Doloremque maxime
            quibusdam, recusandae voluptatem error quisquam ducimus obcaecati.
            Doloremque maxime quibusdam, recusandae voluptatem error quisquam
            ducimus obcaecati.Doloremque maxime quibusdam, recusandae voluptatem
            error quisquam ducimus obcaecati.Doloremque maxime quibusdam,
            recusandae voluptatem error quisquam ducimus obcaecati.
          </p>
        </section>

        <section className='container flow'>
          <div className='page-title'>
            <h3>Our team</h3>
          </div>
          <div className='team-member'>
            <div className='team-photo photo-kieran'></div>
            <p className='fs-200 text-dark about-text'>
              Kieran - pro fighter. Labore consequuntur officia adipisci,
              dolorum et dolorem neque explicabo aut nostrum rem atque.
            </p>
          </div>
          <div className='team-member'>
            <div className='team-photo photo-josh'></div>
            <p className='fs-200 text-dark about-text'>
              Josh - JiuJitsu black-belt. Labore consequuntur officia adipisci,
              dolorum et dolorem neque explicabo aut nostrum rem atque.
            </p>
          </div>
          <div className='team-member'>
            <div className='team-photo photo-bryne'></div>
            <p className='fs-200 text-dark about-text'>
              Bryne - pro MMA fighter. Labore consequuntur officia adipisci,
              dolorum et dolorem neque explicabo aut nostrum rem atque.
            </p>
          </div>
          <div className='team-member'>
            <div className='team-photo photo-souza'></div>
            <p className='fs-200 text-dark about-text'>
              Souza - pro MMA fighter. Labore consequuntur officia adipisci,
              dolorum et dolorem neque explicabo aut nostrum rem atque.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
