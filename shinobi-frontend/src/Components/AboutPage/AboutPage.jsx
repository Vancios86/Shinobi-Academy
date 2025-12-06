// import { memo } from 'react';
import React, { memo, useEffect } from 'react';
import './AboutPage.css';
import Tilt from 'react-parallax-tilt';
import { useContent } from '../../contexts/ContentContext';
import { useLocation } from 'react-router-dom';
import colin from '../../assets/images/colin.webp';

const AboutPage = memo(() => {
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
      </div>
    </div>
  );
});

AboutPage.displayName = 'AboutPage';

export default AboutPage;
