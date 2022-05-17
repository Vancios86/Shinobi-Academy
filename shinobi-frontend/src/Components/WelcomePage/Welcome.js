import './Welcome.css';

const Welcome = () => {
  return (
    <div className='welcome-content'>
      <div className='text-content text-dark flex'>
        <p>
          &quot;Cum explicabo dolore sequi molestias fugit ratione debitis
          quibusdam rem, fuga consectetur dicta itaque numquam labore.&quot;
        </p>
        <h3>Colin Byrne, founder</h3>
      </div>

      <div className='container flex'>
        <video className='media-content flex'>fallback</video>

        <div className='access-button flex'>
          <a
            href='#'
            className='button-large uppercase text-light bg-red fs-600'
          >
            Enter
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
