export const getMarkerColor = (percentage: number): string => {
    if (percentage <= 25) return 'green';         // Low risk
    if (percentage <= 50) return 'orange';      // Moderate risk
    if (percentage > 50) return 'red';      // High risk
    return 'blue';                               // Extreme risk
  };
  
  export const getFloodRiskClass = (percentage: number): string => {
    if (percentage <= 25) return 'text-low';
    if (percentage <= 50) return 'text-moderate';
    if (percentage > 50) return 'text-high';
    return 'text-extreme';
  };
  