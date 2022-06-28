import './CampsPage.css';
import Logo from '../../Logo/Logo';
import Footer from '../../Footer/Footer';

const CampsPage = () => {
  return (
    <div className='camps-page container'>
      <div className='welcome-logo flex'>
        <Logo />
      </div>
      <div className='camps-page-content'>
        <div className='page-title'>
          <h3>Camps</h3>
        </div>
        <div className='camps-description container flow'>
          <p className='text-content'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            saepe quae autem, aperiam pariatur voluptatibus blanditiis sapiente
            vel ut magnam velit ea repellat libero officiis impedit iste illo
            dolorum consectetur eum! Omnis ipsum qui ipsa commodi necessitatibus
            quod maxime. Minima libero maxime veritatis dicta. Ad repellat quas
            quibusdam tenetur animi iusto odit harum voluptatum recusandae!
            Ullam, repellendus! Sit vero labore dolorum nemo debitis, rerum
            asperiores eum officia. Earum vitae quasi accusantium itaque rem
            non, soluta distinctio est quia veritatis, expedita nobis odit
            dolore beatae libero, molestiae sint in reiciendis! Distinctio
            exercitationem sunt dolorum rerum repudiandae in vero at dolorem
            pariatur.
          </p>
          <div className='camps-photo'></div>
        </div>
      </div>
      <div className='secondary-page-footer'>
        <Footer />
      </div>
    </div>
  );
};

export default CampsPage;
