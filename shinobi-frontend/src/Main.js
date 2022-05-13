import './Main.css';
import logo from './logoB.jpeg';

const Main = () => {
  return (
    <div className='main container flex'>
      <div className='logo'>
        <img src={logo} alt='' />
      </div>
      <div className='content'>
        <h2 className='title flex'>SHINOBI</h2>
        <p>Cum explicabo dolore sequi molestias fugit ratione debitis quibusdam rem, fuga consectetur dicta itaque numquam labore nulla doloribus molestiae assumenda eos similique.</p>
        <div className="content">
            <div className="container flex">
              <h3 className="content media flex">fallback</h3>
              <button className="button enter-button">ENTER</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
