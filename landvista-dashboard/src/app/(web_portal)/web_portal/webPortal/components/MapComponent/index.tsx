import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  locations: Location[];
  center: google.maps.LatLngLiteral;
  zoom: number;
  isSmallScreen: boolean;
  boundary: google.maps.LatLngLiteral[];
  searchedLocation?: google.maps.LatLngLiteral; 
  searchLocation: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  locations,
  center,
  zoom,
  isSmallScreen,
  boundary,
  searchedLocation,
}) => {
  const [mapError, setMapError] = useState(false);

 
  useEffect(() => {
    if (searchedLocation) {
      center = searchedLocation; 
      zoom = 15; 
    }
  }, [searchedLocation]);

  return (
    <div className={`absolute top-0 left-0 w-full h-full ${isSmallScreen ? 'flex-col' : ''}`}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        onLoad={() => setMapError(false)}
        onError={() => setMapError(true)}
      >
        {mapError ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded z-20">
            Error loading the map. Please try again later.
          </div>
        ) : (
          <GoogleMap
            id="map"
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={zoom}
          >
            <Marker position={center} />
            {locations.map((location, i) => (
              <Marker key={i} position={location} />
            ))}
            {boundary.length > 0 && (
              <Polygon
                paths={boundary}
                options={{
                  fillColor: "black",
                  fillOpacity: 0.3,
                  strokeColor: "gray",
                  strokeOpacity: 1,
                  strokeWeight: 5,
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default MapComponent;
