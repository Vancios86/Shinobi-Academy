import React, { memo } from 'react';
import Tilt from 'react-parallax-tilt';

const TeamMemberCard = memo(({ props }) => {
  const { id, name, imgSrc, specialty } = { ...props };

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
        <img 
          src={imgSrc} 
          alt={`${name}${specialty ? ` - ${specialty}` : ''}`} 
          loading='lazy' 
          className='coach-photo' 
        />
        <p className='coach-description'>{name}</p>
        {specialty && (
          <p className='coach-specialty'>{specialty}</p>
        )}
      </div>
    </Tilt>
  );
});

TeamMemberCard.displayName = 'TeamMemberCard';

export default TeamMemberCard;
