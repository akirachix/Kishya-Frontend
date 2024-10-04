export const getMarkerColor = (percentage: number): string => {
    if (percentage <= 20) return 'green';         // Low risk
    if (percentage <= 40) return 'orange';      // Moderate risk
    if (percentage <= 60) return 'red';      // High risk
    if (percentage <= 80) return 'red';
    if (percentage > 80 ) return 'red'   // Very high risk
    return 'blue';                               // Extreme risk
  };
  
  export const getFloodRiskClass = (percentage: number): string => {
    if (percentage <= 20) return 'text-low';
    if (percentage <= 40) return 'text-moderate';
    if (percentage <= 60) return 'text-high';
    if (percentage <= 80) return 'text-very-high';
    return 'text-extreme';
  };
  