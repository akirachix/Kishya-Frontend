import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Circle} from '@react-google-maps/api';
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
  viewport?: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
}




const PulsingMarker = (color: string) => `
  <svg width="5000" height="5000" viewBox="0 0 5000 5000" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2500" cy="2500" r="2500" fill="${color}">
      <animate attributeName="r" from="2500" to="3000" dur="0.6s" repeatCount="indefinite" begin="0s" />
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
  viewport,
}) => {
  const [mapError, setMapError] = useState(false);
  const [currentMarker, setCurrentMarker] = useState<Location | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null); 


  const [circleRadius, setCircleRadius] = useState<number>(300); // Start with a valid initial value
  const [circleOpacity, setCircleOpacity] = useState<number>(0); // Start with a valid initial opacity


  useEffect(() => {
    if (searchedLocation) {
      setCurrentMarker(searchedLocation);
  
    } else {
      setCurrentMarker(null);
   
    }
  }, [searchedLocation, boundary]);

  const markerColor = getMarkerColor(floodRiskPercentage);
  const markerIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PulsingMarker(markerColor))}`;
  const fillColor = getMarkerColor(floodRiskPercentage); 

  useEffect(() => {
    if (mapRef.current && viewport) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(new google.maps.LatLng(viewport.northeast.lat, viewport.northeast.lng));
      bounds.extend(new google.maps.LatLng(viewport.southwest.lat, viewport.southwest.lng));
      mapRef.current.fitBounds(bounds);
    }
  }, [viewport]);


 useEffect(() => {
  if (!searchedLocation) return;

  const pulseInterval = setInterval(() => {
    setCircleRadius((prevRadius) => {
      return prevRadius >= 350 ? 300 : prevRadius + 10;
    });

    setCircleOpacity((prevOpacity) => {
      return prevOpacity <= 0 ? 0.35 : prevOpacity - 0.05;
    });
  }, 100);

  return () => clearInterval(pulseInterval); 
}, [searchedLocation, circleRadius, circleOpacity]);




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
            onLoad={(map) => {
              mapRef.current = map; // Set the map ref when the map loads
            }}
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

             {searchedLocation && circleRadius !== null && circleOpacity !== null && (
              <Circle
                center={searchedLocation}
                radius={circleRadius}
                options={{
                  strokeColor: 'transparent',
                  strokeOpacity: 0,
                  strokeWeight: 1,
                  fillColor: fillColor,
                  fillOpacity: circleOpacity, 
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
