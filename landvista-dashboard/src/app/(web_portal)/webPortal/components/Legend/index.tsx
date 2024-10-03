import React from 'react';

interface FloodRiskLegendProps {
  isSmallScreen: boolean;
  id: string;
}

const FloodRiskLegend: React.FC<FloodRiskLegendProps> = ({ isSmallScreen }) => {
  return (
   <div id="legend" className={`
        ${isSmallScreen ? 'fixed  top-[130px] right-4 absolute' : 'absolute top-[600px] right-4'}
        
         bg-white p-2 rounded-lg shadow-lg 
      `} >
        <h3 className="font-bold mb-2">Flood Risk Index</h3>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
  );
};

export default FloodRiskLegend;
