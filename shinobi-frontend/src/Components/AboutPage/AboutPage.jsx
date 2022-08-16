import './AboutPage.css';
import Tilt from 'react-parallax-tilt';
import data from '../../data.json';
import img46 from '../../assets/gallery-assets/gallery-media/img46.jpg';

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
                <img
                  src='https://source.unsplash.com/cVLOqm8sSXc'
                  loading='lazy'
                  alt=''
                />
              </Tilt>
            </div>

            <p className='text-dark text-content' id='about-text'>
              This is Colin Byrne, the founder of Shinobi Academy. Labore
              consequuntur officia adipisci, dolorum et dolorem neque explicabo
              aut nostrum rem atque. Doloremque maxime quibusdam, recusandae
              voluptatem error quisquam ducimus obcaecati. Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Labore consequuntur officia
              adipisci, dolorum et dolorem neque explicabo aut nostrum rem
              atque. Doloremque maxime quibusdam, recusandae voluptatem error
              quisquam ducimus obcaecati. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Labore consequuntur officia adipisci, dolorum et
              dolorem neque explicabo aut nostrum rem atque. Doloremque maxime
              quibusdam, recusandae voluptatem error quisquam ducimus obcaecati.
              Doloremque maxime quibusdam, recusandae voluptatem error quisquam
              ducimus obcaecati.Doloremque maxime quibusdam, recusandae
              voluptatem error quisquam ducimus obcaecati.Doloremque maxime
              quibusdam, recusandae voluptatem error quisquam ducimus obcaecati.
              Labore consequuntur officia adipisci, dolorum et dolorem neque
              explicabo aut nostrum rem atque. Doloremque maxime quibusdam,
              recusandae voluptatem error quisquam ducimus obcaecati. Doloremque
              maxime quibusdam, recusandae voluptatem error quisquam ducimus
              obcaecati. Doloremque maxime quibusdam, recusandae voluptatem
              error quisquam ducimus obcaecati.Doloremque maxime quibusdam,
              recusandae voluptatem error quisquam ducimus obcaecati.
            </p>
            <aside>
              <img src={img46} loading='lazy' alt='shinobi-view' />
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Assumenda molestiae quod alias ex atque est eveniet, numquam
                placeat optio deleniti at natus, explicabo praesentium eligendi
                adipisci itaque nostrum blanditiis laudantium eos fugiat! Illo
                possimus inventore, sed nobis unde quod, expedita consequuntur
                modi minus doloremque enim, recusandae illum. Illum, obcaecati
                quam. Assumenda molestiae quod alias ex atque est eveniet,
                numquam placeat optio deleniti at natus, explicabo praesentium
                eligendi adipisci itaque nostrum blanditiis laudantium eos
                fugiat! Illo possimus inventore, sed nobis unde quod, expedita
                consequuntur modi minus doloremque enim, recusandae illum.
                Illum, obcaecati quam.
              </p>
            </aside>
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
    </div>
  );
};

export default AboutPage;
