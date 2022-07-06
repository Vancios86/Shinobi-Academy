import './MapComponent.css';

const MapComponent = () => {
  return (
    <div className='map shadowed-box'>
      <iframe
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1892.3257328554378!2d-8.671688669433255!3d37.09321738358579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1b31dc1bee800b%3A0xe99ab86564f38beb!2sShinobi%20Mixed%20Martial%20Arts%20Academy!5e0!3m2!1sen!2spt!4v1657115424059!5m2!1sen!2spt'
        width='100%'
        height='100%'
        allowFullScreen=''
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
        title='map-iframe'
      ></iframe>
    </div>
  );
};

export default MapComponent;
