import Header from '../../Header/Header';

import './About.css';

const About = () => {
  return (
    <div className='about-page'>
      <div className='header-container'>
        <Header />
      </div>
      <div className='about-page-content'>
        <section className='top-section container flow'>
          <h1 className='text-light flex page-title about-title'>About</h1>
          <p className='fs-200 text-light about-text'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            consequuntur officia adipisci, dolorum et dolorem neque explicabo
            aut nostrum rem atque. Doloremque maxime quibusdam, recusandae
            voluptatem error quisquam ducimus obcaecati. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Labore consequuntur officia
            adipisci, dolorum et dolorem neque explicabo aut nostrum rem atque.
            Doloremque maxime quibusdam, recusandae voluptatem error quisquam
            ducimus obcaecati. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Labore consequuntur officia adipisci, dolorum et
            dolorem neque explicabo aut nostrum rem atque. Doloremque maxime
            quibusdam, recusandae voluptatem error quisquam ducimus obcaecati.
          </p>
        </section>
        <section className='t-section container flow'>
          <h1 className='text-light flex page-title about-title'>What we do</h1>
          <p className='fs-200 text-light about-text'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore
            consequuntur officia adipisci, dolorum et dolorem neque explicabo
            aut nostrum rem atque. Doloremque maxime quibusdam, recusandae
            voluptatem error quisquam ducimus obcaecati. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Labore consequuntur officia
            adipisci, dolorum et dolorem neque explicabo aut nostrum rem atque.
            Doloremque maxime quibusdam, recusandae voluptatem error quisquam
            ducimus obcaecati. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Labore consequuntur officia adipisci, dolorum et
            dolorem neque explicabo aut nostrum rem atque. Doloremque maxime
            quibusdam, recusandae voluptatem error quisquam ducimus obcaecati.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
