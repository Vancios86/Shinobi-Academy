// import { memo } from 'react';
import React, { memo, useMemo, useEffect } from 'react';
import './AboutPage.css';
import Tilt from 'react-parallax-tilt';
import { useCoaches } from '../../contexts/CoachesContext';
import { useContent } from '../../contexts/ContentContext';
import { useLocation } from 'react-router-dom';
import colin from '../../assets/images/colin.webp';
import view from '../../assets/images/shinobi-view.webp';

const AboutPage = memo(() => {
  const { coachesData, isLoaded } = useCoaches();
  const { contentData, isLoaded: contentLoaded } = useContent();
  const location = useLocation();
  
  // Scroll to top when component mounts or route changes
  useEffect(() => {
    // Use a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when the pathname changes
  
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
                 <div className='page-title variation-3' id='about-page'>
           <h3>Loading...</h3>
           <div className='page-title-accent-line'></div>
         </div>
        <div className='about-page-content shadowed-box'>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='about-page grid'>
                             <div className='page-title variation-3' id='about-page'>
           <h3>{contentData.about.pageTitle}</h3>
           <div className='page-title-accent-line'></div>
         </div>
      <div className='about-page-content shadowed-box rounded-sm'>
        {/* Founder Section - Enhanced Hero */}
        <section className='founder-section'>
          <div className='founder-container'>
            <div className='founder-image-section'>
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
            <div className='founder-content-section'>
              <div className='founder-header'>
                <h2 className='founder-name'>{contentData.about.founderSection.title}</h2>
                <p className='founder-subtitle'>{contentData.about.founderSection.subtitle}</p>
                <div className='founder-accent-line'></div>
              </div>
              <div className='founder-bio'>
                <p>{contentData.about.founderSection.description}</p>
              </div>
              <div className='achievements-container'>
                <h3 className='achievements-title'>Notable Achievements & Partnerships</h3>
                <div className='achievements-grid'>
                  {contentData.about.founderSection.achievements.map((achievement, index) => (
                    <div key={index} className='achievement-card'>
                      <div className='achievement-number'>{String(index + 1).padStart(2, '0')}</div>
                      <p className='achievement-text'>{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section - Feature Showcase */}
        <section className='facilities-section'>
          <div className='facilities-container'>
            <div className='facilities-content'>
              <div className='facilities-header'>
                <h3 className='facilities-title'>{contentData.about.asideSection.title}</h3>
                <div className='facilities-accent-line'></div>
              </div>
              <div className='facilities-description'>
                <p>{contentData.about.asideSection.description}</p>
              </div>
              <div className='facilities-highlight'>
                <h4 className='highlight-title'>World-Class Training Facilities</h4>
                <p className='highlight-text'>{contentData.about.founderSection.facilityDescription}</p>
              </div>
            </div>
            <div className='facilities-visual'>
              <div className='facilities-image-container'>
                <img 
                  src={
                    contentData.about.asideSection.facilitiesImage?.startsWith('http') || 
                    contentData.about.asideSection.facilitiesImage?.startsWith('data:')
                      ? contentData.about.asideSection.facilitiesImage
                      : require(`../../assets/images/${contentData.about.asideSection.facilitiesImage || 'shinobi-view.webp'}`)
                  }
                  loading='lazy' 
                  alt='Shinobi Academy view' 
                />
                <div className='image-caption'>
                  <p>{contentData.about.asideSection.viewDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coaches Section - Enhanced Team Display */}
        <section className='coaches-section'>
          <div className='coaches-container'>
            <div className='coaches-header'>
              <h3 className='coaches-title'>{contentData.about.coachesSection.title}</h3>
              <p className='coaches-subtitle'>{contentData.about.coachesSection.description}</p>
              <div className='coaches-accent-line'></div>
            </div>
            
            <div className='coaches-display'>
              {!isLoaded ? (
                <div className='loading-state'>
                  <div className='loading-indicator'></div>
                  <p>Loading our amazing team...</p>
                </div>
              ) : processedCoachesData.length === 0 ? (
                <div className='empty-state'>
                  <p>Our coaching team will be announced soon!</p>
                </div>
              ) : (
                <div className='coaches-grid'>
                  {processedCoachesData.map((coach, index) => (
                    <div key={coach.id} className='coach-profile'>
                      <div className='coach-image'>
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
                            loading='lazy'
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzExMS4wNDYgMTUwIDEyMCAxNDEuMDQ2IDEyMCAxMzBDMTIwIDExOC45NTQgMTExLjA0NiAxMTAgMTAwIDExMEM4OC45NTQgMTEwIDgwIDExOC45NTQgODAgMTMwQzgwIDE0MS4wNDYgODguOTU0IDE1MCAxMDAgMTUwWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
                            }}
                          />
                        </Tilt>
                      </div>
                      <div className='coach-details'>
                        <h4 className='coach-name'>{coach.name}</h4>
                        {coach.specialty && (
                          <p className='coach-specialty'>{coach.specialty}</p>
                        )}
                        {coach.description && (
                          <p className='coach-description'>{coach.description}</p>
                        )}
                        {!coach.description && !coach.specialty && (
                          <p className='coach-placeholder'>
                            <em>Coach information will be updated soon.</em>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

AboutPage.displayName = 'AboutPage';

export default AboutPage;
