// import { memo } from 'react';
import React, { memo, useMemo } from 'react';
import './AboutPage.css';
import Tilt from 'react-parallax-tilt';
import { useCoaches } from '../../contexts/CoachesContext';
import { useContent } from '../../contexts/ContentContext';
import colin from '../../assets/images/colin.webp';
import view from '../../assets/images/shinobi-view.webp';

const AboutPage = memo(() => {
  const { coachesData, isLoaded } = useCoaches();
  const { contentData, isLoaded: contentLoaded } = useContent();
  
  // Memoize the coaches data processing to avoid unnecessary re-renders
  const processedCoachesData = useMemo(() => {
    if (!coachesData || coachesData.length === 0) return [];
    return coachesData.map(coach => ({
      ...coach,
      // Add any data processing here if needed in the future
    }));
  }, [coachesData]);

  if (!contentLoaded) {
    return (
      <div className='about-page grid'>
        <div className='page-title' id='about-page'>
          <h3>Loading...</h3>
        </div>
        <div className='about-page-content shadowed-box'>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='about-page grid'>
      <div className='page-title' id='about-page'>
        <h3>{contentData.about.pageTitle}</h3>
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
                <img src={colin} loading='lazy' alt={`${contentData.about.founderSection.title} - ${contentData.about.founderSection.subtitle}`} />
              </Tilt>
            </div>
            <div className='team-title flex'>
              <h3>{contentData.about.founderSection.title}</h3>
            </div>
            <p className='text-dark text-content'>
              {contentData.about.founderSection.description}
              {contentData.about.founderSection.achievements.map((achievement, index) => (
                <React.Fragment key={index}>
                  <br />
                  &emsp;• {achievement}
                </React.Fragment>
              ))}
            </p>
            <div className='aside text-dark text-content'>
              <img src={view} loading='lazy' alt='Shinobi Academy view' />
              <div className='team-title flex'>
                <h3>{contentData.about.asideSection.title}</h3>
              </div>
              <p>
                {contentData.about.asideSection.description}
                {contentData.about.founderSection.facilityDescription && (
                  <>
                    <br />
                    {contentData.about.founderSection.facilityDescription}
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        <section className='container flow'>
          <div className='team-title flex'>
            <h3>{contentData.about.coachesSection.title}</h3>
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
