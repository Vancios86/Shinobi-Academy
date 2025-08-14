// import { memo } from 'react';
import React, { memo, useMemo } from 'react';
import './AboutPage.css';
import Tilt from 'react-parallax-tilt';
import { useCoaches } from '../../contexts/CoachesContext';
import colin from '../../assets/images/colin.webp';
import view from '../../assets/images/shinobi-view.webp';

const AboutPage = memo(() => {
  const { coachesData, isLoaded } = useCoaches();
  
  // Memoize the coaches data processing to avoid unnecessary re-renders
  const processedCoachesData = useMemo(() => {
    if (!coachesData || coachesData.length === 0) return [];
    return coachesData.map(coach => ({
      ...coach,
      // Add any data processing here if needed in the future
    }));
  }, [coachesData]);

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
                <img src={colin} loading='lazy' alt='Colin Byrne - Founder' />
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
              <img src={view} loading='lazy' alt='Shinobi Academy view' />
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
          <div className='coaches-description text-dark text-content'>
            {!isLoaded ? (
              <p><em>Loading coaches...</em></p>
            ) : processedCoachesData.length === 0 ? (
              <p><em>No coaches available yet.</em></p>
            ) : (
              processedCoachesData.map((coach) => (
                <p key={coach.id} className='coach-description-item'>
                  <div className='coach-description-header'>
                    <Tilt
                      className='parallax-effect-glare-scale'
                      perspective={500}
                      glareEnable={true}
                      glareMaxOpacity={0.5}
                      scale={1.02}
                    >
                      <img 
                        src={coach.imgSrc} 
                        alt={`${coach.name} - ${coach.specialty || 'Coach'}`}
                        className='coach-description-photo'
                        loading='lazy'
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzExMS4wNDYgMTUwIDEyMCAxNDEuMDQ2IDEyMCAxMzBDMTIwIDExOC45NTQgMTExLjA0NiAxMTAgMTAwIDExMEM4OC45NTQgMTEwIDgwIDExOC45NTQgODAgMTMwQzgwIDE0MS4wNDYgODguOTU0IDE1MCAxMDAgMTUwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                        }}
                      />
                    </Tilt>
                    <div className='coach-description-info'>
                      <strong>{coach.name}</strong>
                      {coach.specialty && (
                        <>
                          <br />
                          <em>{coach.specialty}</em>
                        </>
                      )}
                    </div>
                  </div>
                  {coach.description && (
                    <div className='coach-description-text'>
                      {coach.description}
                    </div>
                  )}
                  {!coach.description && !coach.specialty && (
                    <div className='coach-description-text'>
                      <em>Coach information will be updated soon.</em>
                    </div>
                  )}
                </p>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
});

AboutPage.displayName = 'AboutPage';

export default AboutPage;
