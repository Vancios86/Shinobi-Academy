// import { memo } from 'react';
import './AboutPage.css';
import Tilt from 'react-parallax-tilt';
import data from './coaches-data.json';
import colin from '../../assets/images/colin.webp';
import view from '../../assets/images/shinobi-view.webp';
import TeamMemberCard from './TeamMemberCard';

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
                <img src={colin} loading='lazy' alt='' />
              </Tilt>
            </div>
            <p className='text-dark text-content'>
              Colin Byrne is a martial artist. Started training in 1997 in
              Ninjutsu and became a 3rd Dan Black Belt under Brian McCarthy. He
              has trained with Brian McCarthy with the US Marine corp and Police
              in arrest and constraint. As well he trained and fought Muay Thai
              in Thailand, has a brown belt in Brazilian Jiu Jitsu, obtained a
              silver medal in the European Jiu-Jitsu championships and has
              trained and fought in MMA since 2001. He is part of Team Conor
              McGregor for the last 7 years and has been a corner man for his
              last 3 fights. He is a founding member of McGregor FAST. He
              established Shinobi Academy in 2001 in Lagos Portugal and over the
              years he has welcomed several BJJ, MMA and Kick boxing teams. Many
              great names have trained and coached here: <br />
              &emsp;Conor McGregor chose Shinobi to host his 10 week camp for
              the Justin Porrier 2 fight <br />
              &emsp;Andy Ryan brings a squad of over 50 people every year from
              Team Ryano <br /> &emsp;Silverback Jiu-Jitsu with Mario <br />
              &emsp;Paddy Holohan and Holohan Martial Arts <br />
              &emsp;Mike Russell with MMA Clinic <br />
              &emsp;Dawid Blaszke with Naas Kickboxing <br />
              &emsp;Gunnar Nelson with Mjolnir <br />
              &emsp;Team Kaobon with Mike Melby and Tom Aspinall <br />
              &emsp;ISI running strength and condition camps...and I appologise
              to those whom I might've forgot about when wrighting this
              description. <br />
              The Facility has 2 large matted rooms for martial arts as well as
              an assortment of bags for striking. The strength and conditioning
              room has 2 Olympic lifting platforms , 2 lifting racks, hack squat
              machine, reverse hyper machine, sleds, Wattbike, Concept 2 rower ,
              inversion table and more.
            </p>
            <div className='aside text-dark text-content'>
              <img src={view} loading='lazy' alt='shinobi-view' />
              <p>
                The Dojo is available for training camps for teams and clubs.
                The strength and conditioning room is also available for small
                groups . We also run our own training camps. MMA and Grappling
                with guest coaches throughout the year. <br />
                Shinobi Academy is as well known for having one the best views
                in the entire world. If you don't believe me, check out this
                capture and I dare you to prove me wrong:).
              </p>
            </div>
          </div>
        </section>

        <section className='container flow'>
          <div className='team-title flex'>
            <h3>SHINOBI COACHES</h3>
          </div>
          <div className='coaches-wrapper container grid'>
            {data?.teamMembers.map((member, idx) => (
              <TeamMemberCard props={member} key={idx} />
            ))}
          </div>
          <div className='coaches-description text-dark text-content'>
            <p>
              <strong>Colin Byrne</strong>
              <br />
              Founder of Shinobi Academy, Brazilian Jiu-Jitsu brown belt,
              medalist in European Jiu-Jitsu Championships, MMA fighter and
              coach for over 20 years, 3rd Dan Black Belt in Ninjustu under
              Brian McCarthy, corner man and part of Team Conor McGregor,
              founding member of McGregor Fast
            </p>
            <p>
              <strong>Jeff Knight</strong>
              <br />
              Brazilian Jiu-Jitsu black belt under John Danaher. Trained for 12
              years in Renzo Grecie’s Academy in New York city. Jeff is an
              excellent practitioner in Gi and also No Gi. and has coached all
              over the world, including GlobeTrotters
            </p>
            <p>
              <strong>Ivo Guerreiro</strong>
              <br />
              MMA fighter and Jiu-Jitsu Purple belt. Ivo is training over 12
              year , great coach and a huge part of the academy
            </p>
             <p>
              <strong>Antonio Souza</strong>
              <br />
              MMA fighter and Jiu-Jitsu Purple belt. Souza has a vast experience in various styles of Martial Arts ...description ...
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
