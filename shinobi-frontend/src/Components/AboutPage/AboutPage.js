import './AboutPage.css';
import Tilt from 'react-parallax-tilt';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

const AboutPage = () => {
  return (
    <ParallaxProvider>
      <div className='about-page grid'>
        <div className='about-page-content'>
          <section className='container flow'>
            <div className='page-title' id='about-page'>
              <h3>About us</h3>
            </div>

            <div className='container'>
              <div className='photo-colin'>
                <Tilt
                  className='parallax-effect-glare-scale'
                  perspective={500}
                  glareEnable={true}
                  glareMaxOpacity={0.5}
                  scale={1.01}
                >
                  <img src='https://source.unsplash.com/cVLOqm8sSXc' alt='' />
                </Tilt>
              </div>

              <p className='text-dark text-content' id='about-text'>
                This is Colin Byrne, the founder of Shinobi Academy. Labore
                consequuntur officia adipisci, dolorum et dolorem neque
                explicabo aut nostrum rem atque. Doloremque maxime quibusdam,
                recusandae voluptatem error quisquam ducimus obcaecati. Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Labore
                consequuntur officia adipisci, dolorum et dolorem neque
                explicabo aut nostrum rem atque. Doloremque maxime quibusdam,
                recusandae voluptatem error quisquam ducimus obcaecati. Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Labore
                consequuntur officia adipisci, dolorum et dolorem neque
                explicabo aut nostrum rem atque. Doloremque maxime quibusdam,
                recusandae voluptatem error quisquam ducimus obcaecati.
                Doloremque maxime quibusdam, recusandae voluptatem error
                quisquam ducimus obcaecati.Doloremque maxime quibusdam,
                recusandae voluptatem error quisquam ducimus
                obcaecati.Doloremque maxime quibusdam, recusandae voluptatem
                error quisquam ducimus obcaecati.
              </p>
            </div>
          </section>
          <Parallax speed={16} opacity={[1]}>
            <section className='container flow'>
              <div className='team-title'>
                <h3>MEET OUR TEAM</h3>
              </div>

              <div className='coaches-wrapper container grid'>
                <Tilt
                  className='parallax-effect-glare-scale'
                  perspective={500}
                  glareEnable={true}
                  glareMaxOpacity={0.5}
                  scale={1.02}
                >
                  <div className='team-member'>
                    <div className='coach-photo photo-colin-coach'></div>
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
                  <div className='team-member'>
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
                  <div className='team-member'>
                    <div className='coach-photo photo-josh'></div>
                    <p className='coach-description'>
                      Name: Josh <br /> Experience: 20years <br /> Skills: BJJ
                      black belt, multiple European podium finisher
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
                  <div className='team-member'>
                    <div className='coach-photo photo-bryne'></div>
                    <p className='coach-description'>
                      Name: Bryne <br /> Experience: 20years <br /> Skills: pro
                      fighter, wrestling, boxing
                    </p>
                  </div>
                </Tilt>
              </div>
            </section>
          </Parallax>
        </div>
      </div>
    </ParallaxProvider>
  );
};

export default AboutPage;
