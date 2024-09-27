export interface MapInfo {
    totalLandArea: string;
    averageAnnualRainfall: string;
    disclaimer: string;
}

export interface FloodRiskData {
    location: string;
    risk_percentage: number;
    soil_type: string;
    elevation: number;
    risk_category: string;
    additional_information: string;
    map_url: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        bounds: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    locations?: Array<{ lat: number; lng: number; label: string }>; 
    mapInfo?: MapInfo; 
    boundary?: google.maps.LatLngLiteral[];
}
