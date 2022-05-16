import "./Welcome.css";

const Welcome = () => {
  return (
    <div className='content'>
      <div className='text-content text-dark flex'>
        <p>
          &quot;Cum explicabo dolore sequi molestias fugit ratione debitis
          quibusdam rem, fuga consectetur dicta itaque numquam labore.&quot;
        </p>
        <h3>Colin Byrne, founder</h3>
      </div>

      <div className='container flex'>
        <h3 className='content media flex'>fallback</h3>
        <button className='button enter-button bg-red text-silver'>
          ENTER
        </button>
      </div>
    </div>
  );
};

export default Welcome;
