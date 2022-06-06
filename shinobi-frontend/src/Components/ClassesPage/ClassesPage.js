import './ClassesPage.css';

const ClassesPage = () => {
  return (
    <div className='classes-page grid'>
      <div className='classes-page-content'>
        <section className='container flow'>
          <div className='page-title' id='classes-page'>
            <h3>Our Classes</h3>
          </div>
          <div className='grid fs-600 text-silver'>
            <div className='classes class-jj'>
              <h3>JiuJitsu</h3>
            </div>
            <div className='classes class-s'>
              <h3>Striking</h3>
            </div>
            <div className='classes class-w'>
              <h3>MMA Positional</h3>
            </div>
            <div className='classes class-spar'>
              <h3>Sparring</h3>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClassesPage;
