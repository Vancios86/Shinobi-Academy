import './AboutPage.css';
import Tilt from 'react-parallax-tilt';

const AboutPage = () => {
  return (
    <div className='about-page grid'>
      <div className='about-page-content'>
        <section className='container flow'>
          <div className='page-title' id='about-page'>
            <h3>About us</h3>
          </div>
          <div className='photo-colin border-red'></div>
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
            <h3>Our coaches</h3>
          </div>
          <div className='coaches-wrapper container grid'>
            <Tilt
              className='parallax-effect-glare-scale'
              perspective={500}
              glareEnable={true}
              glareMaxOpacity={0.5}
              scale={1.02}
            >
              <div className='coach-member'>
                <div className='coach-photo photo-souza'></div>
                <p className='coach-description'>
                  Name: Colin <br /> Experience: 20+years <br />
                  Skills: pro fighter, BJJ, Ninjutsu BlackBelt
                </p>
              </div>
            </Tilt>
            <Tilt
              className='parallax-effect-glare-scale'
              perspective={500}
              glareEnable={true}
              glareMaxOpacity={0.5}
              scale={1.02}
            >
              <div className='coach-member'>
                <div className='coach-photo photo-kieran'></div>
                <p className='coach-description'>
                  Name: Kieran <br /> Experience: 10years <br />
                  Skills: pro MMA fighter, BJJ purple belt
                </p>
              </div>
            </Tilt>
            <Tilt
              className='parallax-effect-glare-scale'
              perspective={500}
              glareEnable={true}
              glareMaxOpacity={0.5}
              scale={1.02}
            >
              <div className='coach-member'>
                <div className='coach-photo photo-josh'></div>
                <p className='coach-description'>
                  Name: Josh <br /> Experience: 20years <br /> Skills: BJJ black
                  belt, multiple European podium finisher
                </p>
              </div>
            </Tilt>
            <Tilt
              className='parallax-effect-glare-scale'
              perspective={500}
              glareEnable={true}
              glareMaxOpacity={0.5}
              scale={1.02}
            >
              <div className='coach-member'>
                <div className='coach-photo photo-bryne'></div>
                <p className='coach-description'>
                  Name: Bryne <br /> Experience: 20years <br /> Skills: pro
                  fighter, wrestling, boxing
                </p>
              </div>
            </Tilt>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
