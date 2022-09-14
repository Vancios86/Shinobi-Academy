import './AboutPage.css';
import { Parallax } from 'react-scroll-parallax';
import Tilt from 'react-parallax-tilt';
import data from '../../data.json';

const teamMemberCard = (id, name, xp, skills, imgSrc) => {
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
        <img src={imgSrc} alt='coach' loading='lazy' className='coach-photo' />
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
    <Parallax opacity={[3, 0]}>
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
                    src='http://drive.google.com/uc?export=view&id=1TQwYYblkerfK6vIGBO3J2mSjSHo0WYR8'
                    loading='lazy'
                    alt=''
                  />
                </Tilt>
              </div>

              <p className='text-dark text-content' id='about-text'>
                Colin Byrne is a martial artist. Started training in 1997 in
                Ninjutsu and became a 3rd Dan Black Belt under Brian McCarthy.
                He has trained with Brian McCarthy with the US Marine corp and
                Police in arrest and constraint. As well he trained and fought
                Muay Thai in Thailand, has a brown belt in Brazilian Jiu Jitsu,
                obtained a silver medal in the European Jiu-Jitsu championships
                and has trained and fought in MMA since 2001. He is part of Team
                Conor McGregor for the last 7 years and has been a corner man
                for his last 3 fights. He is a founding member of McGregor FAST.
                He established Shinobi Academy in 2001 in Lagos Portugal and
                over the years he has welcomed several BJJ, MMA and Kick boxing
                teams. Many great names have trained and coached here: <br />
                &emsp;Conor McGregor chose Shinobi to host his 10 week camp for
                the Justin Porrier 2 fight <br />
                &emsp;Andy Ryan brings a squad of over 50 people every year from
                Team Ryano <br /> &emsp;Silverback Jiu-Jitsu with Mario <br />
                &emsp;Paddy Holohan and Holohan Martial Arts <br />
                &emsp;Mike Russell with MMA Clinic <br />
                &emsp;Dawid Blaszke with Naas Kickboxing <br />
                &emsp;Gunnar Nelson with Mjolnir <br />
                &emsp;Team Kaobon with Mike Melby and Tom Aspinall <br />
                &emsp;ISI running strength and condition camps...and I
                appologise to those whom I might've forgot about when wrighting
                this description. <br />
                The Facility has 2 large matted rooms for martial arts as well
                as an assortment of bags for striking. The strength and
                conditioning room has 2 Olympic lifting platforms , 2 lifting
                racks, hack squat machine, reverse hyper machine, sleds,
                Wattbike, Concept 2 rower , inversion table and more.
              </p>
              <aside>
                <img
                  src='http://drive.google.com/uc?export=view&id=1ntUYasVeOLJNPBsL1d5JcRLNMxH3JY03'
                  loading='lazy'
                  alt='shinobi-view'
                />
                <p>
                  The Dojo is available for training camps for teams and clubs.
                  The strength and conditioning room is also available for small
                  groups . We also run our own training camps. MMA and Grappling
                  with guest coaches throughout the year. <br />
                  Shinobi Academy is as well known for having one the best views
                  in the entire world. If you don't believe me, check out this
                  capture and I dare you to prove me wrong:).
                </p>
              </aside>
            </div>
          </section>

          <section className='container flow'>
            <div className='team-title flex'>
              <h3>OUR RESIDENT TRAINERS</h3>
            </div>

            <div className='coaches-wrapper container grid'>
              {data.teamMembers.map((member) =>
                teamMemberCard(
                  member.id,
                  member.name,
                  member.xp,
                  member.skills,
                  member.imgSrc
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </Parallax>
  );
};

export default AboutPage;
