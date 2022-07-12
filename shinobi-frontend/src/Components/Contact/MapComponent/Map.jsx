import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { MarkerClusterer, Marker } from '@react-google-maps/api';
import './MapComponent.css';
import { useState, useCallback, memo } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 37.09314,
  lng: -8.66983,
};

function MyMap() {
  const [map, setMap] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDjvj28M8xkVs572yBWCNlnL1nfNq9caQI',
  });

  function createKey() {
    return center.lat + center.lng;
  }

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div className='map shadowed-box'>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <MarkerClusterer>
          {(clusterer) => (
            <Marker
              key={createKey()}
              position={center}
              clusterer={clusterer}
              map={map}
            />
          )}
        </MarkerClusterer>
        <></>
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

export default memo(MyMap);
