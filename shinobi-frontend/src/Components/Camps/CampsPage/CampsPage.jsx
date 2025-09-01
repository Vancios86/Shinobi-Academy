import './CampsPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const CampsPage = () => {
  const [enteringCampsPage, setEnteringCampsPage] = useState(false);
  const [visibleSections, setVisibleSections] = useState([]);
  const navigate = useNavigate();
  const timelineRefs = useRef([]);

  useEffect(() => {
    setEnteringCampsPage(true);
    if (enteringCampsPage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [enteringCampsPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => [...prev, entry.target.dataset.index]);
          }
        });
      },
      { threshold: 0.3 }
    );

    timelineRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const campsData = [
    {
      id: 1,
      title: 'Team Ryano',
      description: 'High-performance training camp with world-class coaching',
      videoId: '755202131',
      videoHash: 'b12193bd19',
      category: 'MMA Training',
      month: 'January',
      year: '2024',
      story: 'Our flagship MMA training camp kicked off the year with Team Ryano, bringing together elite fighters from across the region. This intensive program focused on advanced striking techniques, takedown defense, and competition preparation.',
      highlights: ['Advanced striking combinations', 'Takedown defense drills', 'Competition simulation', 'Strength & conditioning'],
      participants: '25+ Elite Athletes',
      duration: '5 Days',
      intensity: 'High'
    },
    {
      id: 2,
      title: 'Silverback Jiujitsu',
      description: 'Advanced grappling techniques and competition preparation',
      videoId: '755202930',
      videoHash: 'd537e645c5',
      category: 'BJJ Camp',
      month: 'March',
      year: '2022',
      story: 'The Silverback Jiujitsu camp brought together some of the most skilled grapplers in the country. This specialized program focused on advanced guard techniques, submissions, and competition strategies.',
      highlights: ['Advanced guard techniques', 'Submission chains', 'Competition strategies', 'Mental preparation'],
      participants: '30+ Grapplers',
      duration: '4 Days',
      intensity: 'Medium-High'
    },
    {
      id: 3,
      title: 'Mark Roper',
      description: 'Specialized coaching session with international expertise',
      videoId: '752482165',
      videoHash: '2b609f21c0',
      category: 'Specialist Training',
      month: 'June',
      year: '2024',
      story: 'International coach Mark Roper brought his unique perspective and techniques to our academy. This specialized camp focused on innovative training methods and mental conditioning.',
      highlights: ['Innovative techniques', 'Mental conditioning', 'International perspective', 'Personal development'],
      participants: '15+ Coaches',
      duration: '3 Days',
      intensity: 'Medium'
    },
    {
      id: 4,
      title: 'Irish Strength Institute',
      description: 'Comprehensive strength and conditioning program',
      videoId: '755204264',
      videoHash: 'c33611bc76',
      category: 'Strength & Conditioning',
      month: 'September',
      year: '2024',
      story: 'The Irish Strength Institute collaboration brought cutting-edge strength and conditioning methods to our athletes. This comprehensive program focused on building power, endurance, and injury prevention.',
      highlights: ['Power development', 'Endurance training', 'Injury prevention', 'Recovery protocols'],
      participants: '20+ Athletes',
      duration: '6 Days',
      intensity: 'High'
    }
  ];

  // Sort camps by date (chronological order)
  const sortedCampsData = campsData.sort((a, b) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const aMonthIndex = months.indexOf(a.month);
    const bMonthIndex = months.indexOf(b.month);
    
    // First compare years
    if (a.year !== b.year) {
      return parseInt(a.year) - parseInt(b.year);
    }
    
    // If same year, compare months
    return aMonthIndex - bMonthIndex;
  });

  return (
    <div className='camps-page'>
      <div className='camps-content'>
        {/* Logo Section */}
        <div className='welcome-logo flex'>
          <Logo />
        </div>
        
        {/* Back Button */}
        <button
          className='back-button flex rounded-sm'
          onClick={() => {
            navigate(-1);
          }}
        >
          <b>↞</b>
        </button>

        {/* Hero Section */}
        <div className='camps-hero-section'>
          <div className='hero-content'>
            <h1 className='hero-title'>
              Our Training <span className='accent-text camps-animation'>Camps</span> Journey
            </h1>
            <p className='hero-subtitle'>
              Follow the evolution of our training camps throughout the year. Each camp 
              represents a unique chapter in our martial arts story, bringing together 
              athletes, coaches, and techniques from around the world.
            </p>
            <div className='journey-stats'>
              <div className='journey-stat'>
                <span className='stat-number'>4</span>
                <span className='stat-label'>Chapters</span>
              </div>
              <div className='journey-stat'>
                <span className='stat-number'>12</span>
                <span className='stat-label'>Months</span>
              </div>
              <div className='journey-stat'>
                <span className='stat-number'>90+</span>
                <span className='stat-label'>Athletes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='camps-page-wrapper'>
          <div className='camps-intro-section'>
            <div className='intro-content'>
              <h2 className='section-title'>The Story of Our Camps</h2>
              <p className='intro-text'>
                Scroll through our timeline to experience the progression of our training 
                camps throughout the year. Each camp builds upon the previous, creating 
                a comprehensive martial arts journey.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className='timeline-container'>
            <div className='timeline-line'></div>
            
            {sortedCampsData.map((camp, index) => (
              <div 
                key={camp.id} 
                className={`timeline-item ${visibleSections.includes(index.toString()) ? 'visible' : ''}`}
                ref={el => timelineRefs.current[index] = el}
                data-index={index}
              >
                <div className='timeline-marker'>
                  <div className='marker-dot'></div>
                  <div className='marker-date'>
                    <span className='month'>{camp.month}</span>
                    <span className='year'>{camp.year}</span>
                  </div>
                </div>
                
                <div className='timeline-content shadowed-box rounded-sm'>
                  <div className='timeline-header'>
                    <div className='camp-category'>{camp.category}</div>
                    <h3 className='camp-title'>{camp.title}</h3>
                    <div className='camp-meta'>
                      <span className='meta-item'>{camp.participants}</span>
                      <span className='meta-item'>{camp.duration}</span>
                      <span className='meta-item intensity'>{camp.intensity}</span>
                    </div>
                  </div>
                  
                  <div className='timeline-story'>
                    <p className='story-text'>{camp.story}</p>
                  </div>
                  
                  <div className='timeline-highlights'>
                    <h4 className='highlights-title'>Key Highlights</h4>
                    <div className='highlights-grid'>
                      {camp.highlights.map((highlight, idx) => (
                        <div key={idx} className='highlight-item'>
                          <span className='highlight-icon'>⚡</span>
                          <span className='highlight-text'>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className='timeline-video'>
                    <div className='video-container'>
                      <div className='video-wrapper'>
                        <iframe
                          src={`https://player.vimeo.com/video/${camp.videoId}?h=${camp.videoHash}&badge=0&autopause=0&player_id=0&app_id=58479`}
                          frameBorder='0'
                          allow='autoplay; fullscreen; picture-in-picture'
                          allowFullScreen
                          loading='lazy'
                          title={camp.title}
                          className='camp-video'
                        ></iframe>
                      </div>
                    </div>
                  </div>
                  
                  <div className='timeline-cta'>
                    <button className='learn-more-button rounded-sm'>
                      Learn More About This Camp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className='contact-cta-section'>
            <div className='cta-content shadowed-box rounded-sm'>
              <h2 className='cta-title'>Join Our Next Chapter</h2>
              <p className='cta-text'>
                Be part of our ongoing martial arts journey. Contact us to learn about 
                upcoming camps and how you can participate in the next chapter of our story.
              </p>
              <button className='cta-button rounded-sm' onClick={() => navigate('/contact')}>
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CampsPage;
