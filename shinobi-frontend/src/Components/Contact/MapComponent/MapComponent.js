import './MapComponent.css';

const MapComponent = () => {
  return (
    <div className='map shadowed-box'>
      <iframe
        src='https://storage.googleapis.com/maps-solutions-ung9ttokjq/locator-plus/qfam/locator-plus.html'
        width='100%'
        height='100%'
        loading='lazy'
        title='gmap'
      ></iframe>
    </div>
  );
};

export default MapComponent;
