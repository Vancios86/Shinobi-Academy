import './AboutPage.css';
import Tilt from 'react-parallax-tilt';
import { Parallax } from 'react-scroll-parallax';
import data from '../../data.json';

const teamMemberCard = (id, name, xp, skills) => {
  return (
    <Tilt
      className='parallax-effect-glare-scale'
      perspective={500}
      glareEnable={true}
      glareMaxOpacity={0.5}
      scale={1.02}
      key={id}
    >
      <div className='team-member'>
        <div className='coach-photo photo-colin-coach'></div>
        <p className='coach-description'>
          Name: {name} <br /> Experience: {xp} <br />
          Skills: {skills}
        </p>
      </div>
    </Tilt>
  );
};

const AboutPage = () => {
  return (
    <div className='about-page grid'>
      <div className='page-title' id='about-page'>
        <h3>About us</h3>
      </div>
      <Parallax speed={-3} opacity={[3, 0]}>
        <div className='about-page-content shadowed-box'>
          <section className='container flow'>
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
                error quisquam ducimus obcaecati. Labore consequuntur officia
                adipisci, dolorum et dolorem neque explicabo aut nostrum rem
                atque. Doloremque maxime quibusdam, recusandae voluptatem error
                quisquam ducimus obcaecati. Doloremque maxime quibusdam,
                recusandae voluptatem error quisquam ducimus obcaecati.
                Doloremque maxime quibusdam, recusandae voluptatem error
                quisquam ducimus obcaecati.Doloremque maxime quibusdam,
                recusandae voluptatem error quisquam ducimus obcaecati.
              </p>
            </div>
          </section>

          <section className='container flow'>
            <div className='team-title flex'>
              <h3>MEET OUR TEAM</h3>
            </div>

            <div className='coaches-wrapper container grid'>
              {data.teamMembers.map((member) =>
                teamMemberCard(member.id, member.name, member.xp, member.skills)
              )}
            </div>
          </section>
        </div>
      </Parallax>
    </div>
  );
};

export default AboutPage;
