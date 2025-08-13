import { memo } from 'react';
import Tilt from 'react-parallax-tilt';

const TeamMemberCard = ({ props }) => {
  const { id, name, imgSrc } = { ...props };

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
        <p className='coach-description'>{name}</p>
      </div>
    </Tilt>
  );
};

export default memo(TeamMemberCard);
