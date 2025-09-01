import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah O'Connor",
      rank: "Purple Belt",
      image: "🥋",
      text: "Shinobi Academy transformed my life. The coaches here don't just teach techniques - they build character. I've gained confidence, discipline, and a second family. The training is intense but always safe and supportive.",
      rating: 5
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      rank: "Black Belt",
      image: "🥋",
      text: "After 8 years of training here, I can honestly say this is the best martial arts academy I've ever been to. The level of instruction is world-class, and the community is incredible. I've competed internationally and always felt prepared.",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Thompson",
      rank: "Blue Belt",
      image: "🥋",
      text: "As a beginner, I was nervous about starting martial arts, but the team here made me feel welcome from day one. The classes are challenging but accessible, and I've seen amazing progress in just 6 months.",
      rating: 5
    },
    {
      id: 4,
      name: "David Chen",
      rank: "Brown Belt",
      image: "🥋",
      text: "The attention to detail in technique is outstanding. Every class I learn something new, and the coaches are always pushing us to be better versions of ourselves. This place is more than a gym - it's a way of life.",
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <section className="testimonials-section shadowed-box rounded-sm">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Students Say</h2>
          <p className="testimonials-subtitle">
            Real stories from real people who found their strength at Shinobi Academy
          </p>
        </div>
        
        <div className="testimonials-grid">
          {/* First set of testimonials */}
          {testimonials.map((testimonial) => (
            <div key={`first-${testimonial.id}`} className="testimonial-card shadowed-box">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {testimonial.image}
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-rank">{testimonial.rank}</p>
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              
              <blockquote className="testimonial-text">
                "{testimonial.text}"
              </blockquote>
            </div>
          ))}
          
          {/* Duplicate set for seamless loop */}
          {testimonials.map((testimonial) => (
            <div key={`second-${testimonial.id}`} className="testimonial-card shadowed-box">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {testimonial.image}
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-rank">{testimonial.rank}</p>
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              
              <blockquote className="testimonial-text">
                "{testimonial.text}"
              </blockquote>
            </div>
          ))}
        </div>
        
        <div className="testimonials-cta">
          <p className="cta-text">Ready to start your martial arts journey?</p>
          <button className="cta-button rounded-sm">
            Join Us Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
