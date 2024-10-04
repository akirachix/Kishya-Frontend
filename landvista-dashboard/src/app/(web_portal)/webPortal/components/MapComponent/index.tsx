import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { getMarkerColor } from '../../utils/floodRiskColors';



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
  floodRiskPercentage: number;
}

const PulsingMarker = (color: string) => `
  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <circle cx="15" cy="15" r="10" fill="${color}">
      <animate attributeName="r" from="10" to="15" dur="0.6s" repeatCount="indefinite" begin="0s" />
      <animate attributeName="fill-opacity" from="1" to="0" dur="0.6s" repeatCount="indefinite" begin="0s" />
    </circle>
  </svg>
`;


const MapComponent: React.FC<MapComponentProps> = ({
  locations,
  center,
  zoom,
  isSmallScreen,
  searchedLocation,
  boundary,
  floodRiskPercentage,
}) => {
  const [mapError, setMapError] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<Location | null>(null);
  
  useEffect(() => {
    if (searchedLocation) {
      setCurrentMarker(searchedLocation);
  
    } else {
      setCurrentMarker(null);
   
    }
  }, [searchedLocation, boundary]);

  const markerColor = getMarkerColor(floodRiskPercentage);
  console.log('Marker Color:', markerColor); 
 
  const markerIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PulsingMarker(markerColor))}`;

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
            center={searchedLocation || center}
            zoom={searchedLocation ? 15 : zoom}
          >
            {currentMarker && (
              <Marker
                position={currentMarker}
                icon={{
                  url: markerIcon,
                  scaledSize: new google.maps.Size(30, 30),
                }}
              />
            )}

      

            {locations.map((location, i) => (
              <Marker key={i} position={location} />
            ))}

            {searchedLocation && (
              <Circle
                center={searchedLocation}
                radius={500}
                options={{
                  strokeColor: "teal",
                  strokeOpacity: 0.8,
                  strokeWeight: 1,
                  fillColor: "rgba(0, 128, 128, 0.2)",
                  fillOpacity: 0.35,
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
