export interface MapInfo {
    totalLandArea: string;
    averageAnnualRainfall: string;
    disclaimer: string;
}


export interface SeasonalRiskInfo {
    risk_category: string;
    additional_information: string;
}


export interface Geometry {
    location?: {
        lat: number;
        lng: number;
    };
    bounds?: {
        northeast: {
            lat: number;
            lng: number;
        };
        southwest: {
            lat: number;
            lng: number;
        };
    };
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

export interface FloodRiskData {
    location: string;
    risk_percentage: {
        short_rains: number;
        long_rains: number;
        long_dry_season: number;
        short_dry_season: number;
    };
    soil_type: string;
    elevation: number;
    risk_category: string;
    geometry: Geometry;
    seasonal_information: {
        short_rains: SeasonalRiskInfo;
        long_rains: SeasonalRiskInfo;
        long_dry_season: SeasonalRiskInfo;
        short_dry_season: SeasonalRiskInfo;
    };
    map_url: string;
    locations?: Array<{ lat: number; lng: number; label: string }>; 
    mapInfo?: MapInfo; 
    boundary?: google.maps.LatLngLiteral[];
}
