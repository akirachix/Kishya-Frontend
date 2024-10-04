import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Download, MessageSquare } from 'react-feather';
import FeedbackButton from '../FeedbackButton';
import { getFloodRiskClass } from '../../utils/floodRiskColors';

interface InfoPanelProps {
  location: string;
  handleDownload: () => void;
  isSmallScreen: boolean;
  isPanelMinimized: boolean;
  shouldPanelBeOpen: boolean; 
  handlePanelToggle:() => void;
  soilType: string;
  elevation: number;
  floodRiskPercentage: number;
  additionalInfo: string;
  mapInfo: {
    totalLandArea: string;
    averageAnnualRainfall: string;
    disclaimer: string;
  };
  loading: boolean; 
  onOpenFeedback: () => void; 
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  location,
  handleDownload,
  onOpenFeedback,
  elevation,
  floodRiskPercentage,
  additionalInfo,
  mapInfo,
  shouldPanelBeOpen, 
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(true);
  

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const smallScreen = width < 640 ||
        (width <= 1280 && height <= 800) ||
        (width <= 1024 && height <= 600) ||
        (width <= 912 && height <= 1368) ||
        (width <= 1024 && height <= 1366) ||
        (width <= 820 || height <= 180) ||
        (width <= 768 && height <= 1024);

      setIsSmallScreen(smallScreen);
      if (smallScreen) {
        setIsPanelMinimized(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePanelToggle = () => {
    setIsPanelMinimized(!isPanelMinimized);
  };


  useEffect(() => {
    if (shouldPanelBeOpen) {
      setIsPanelMinimized(false);  
    }
  }, [shouldPanelBeOpen]);


  
  const defaultLandArea = mapInfo.totalLandArea || "N/A";
  const defaultAverageRainfall = mapInfo.averageAnnualRainfall || "N/A";
  const defaultDisclaimer = mapInfo.disclaimer || "No disclaimer available.";




  const floodRiskClass = getFloodRiskClass(floodRiskPercentage);

  return (
    <div id="info-panel"  className={`
      ${isSmallScreen ? 'rounded-b-none fixed bottom-0 left-0 right-0' : 'absolute top-20 left-4'}
      ${isSmallScreen ? (isPanelMinimized ? 'w-16 h-16 overflow-hidden' : 'w-full h-2/3 overflow-y-auto') : 'w-[400px] h-[830px] '} 
      bg-white rounded-[50px] shadow-lg
      border-2 border-teal-600
      flex flex-col 
      z-10 
    `} style={{ borderRadius: '20px' }}>
     <div className={`bg-teal-600 rounded-t-[15px] p-4 flex justify-center items-center ${isSmallScreen ? 'h-[160px]' : 'h-[180px]'}`}>

     <Image
  src="/media/whitelogo.png" 
  alt="LandVista Logo"
  width={isSmallScreen ? (isPanelMinimized ? 200 : 90) : 200} 
  height={isSmallScreen ? (isPanelMinimized ? 200 : 80) : 250}
  className="object-contain"
/>
      </div>

      <div className={`bottom-0 rounded-b-none text-teal-600 p-6 bg-white flex-1 ${isSmallScreen && isPanelMinimized ? 'hidden' : ''} flex flex-col`}>
      
    <p className="text-lg mb-2 font-semibold">Location <br/> <span className="font-light">{location}</span></p>

    {location === "Nairobi" ? (
        <>
            <p className="text-lg mb-2 font-semibold text-justify">Total Land Area <br></br><span className="font-light">{defaultLandArea}</span></p>
            <p className="text-lg mb-2 font-semibold text-justify">Average Annual Rainfall <br></br> <span className="font-light">{defaultAverageRainfall}</span></p>
            <p className="text-lg mb-2 text-justify font-semibold ">Disclaimer <br></br><span className="font-light">{defaultDisclaimer}</span></p>
        </>
    ) : (
        <>
           
         
            <p className="text-lg mb-2 font-semibold text-justify">Elevation <br/> <span className="font-light">{elevation} meters</span></p>
            <p className={`text-lg mb-2 font-semibold text-justify ${floodRiskClass}`}>Flood Risk Percentage <br/> <span className="font-light">{floodRiskPercentage}%</span></p>
            <p className="text-lg mb-2 font-semibold text-justify">Additional Information <br/> <span className="font-light">{additionalInfo}</span></p>
        </>
    )}
</div>

  {!isSmallScreen && (
 <div className={`mt-auto flex flex-col sm:flex-row justify-between p-4 bg-teal-600 rounded-b-[15px] ${isSmallScreen && isPanelMinimized ? 'hidden' : ''}`}>
 <button onClick={handleDownload} className="bg-custom-dark-orange text-white px-4 py-2 rounded-full flex items-center justify-center">
   <Download size={20} className="mr-2" /> Download
 </button>
   <FeedbackButton onOpen={onOpenFeedback}  /> 
</div>
     )  }
     

      {isSmallScreen && (
        <div className="fixed bottom-[200px] right-2 flex flex-col space-y-4">
          <div className="relative group">
            <button onClick={handlePanelToggle} className="w-12 h-12 rounded-full flex items-center justify-center bg-custom-teal text-white">
              {isPanelMinimized ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
            <div className="absolute right-full bottom-1/2 transform -translate-y-1/2 w-max p-2 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {isPanelMinimized ? 'Tap to open' : 'Tap to close'}
            </div>
            
          </div>
          <div className="relative group">
            <button onClick={handleDownload} className="bg-custom-dark-orange text-white w-12 h-12 rounded-full flex items-center justify-center">
              <Download size={24} />
            </button>
            <div className="absolute right-full bottom-1/2 transform -translate-y-1/2 w-max p-2 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Download PDF
            </div>
          </div>

          <div className="relative">
                <button onClick={onOpenFeedback} className="bg-blue-500  text-white w-12 h-12 rounded-full flex items-center justify-center">
                    <MessageSquare size={24} />
                </button>

                <div className="absolute right-full bottom-1/2 transform -translate-y-1/2 w-max p-2 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Want to tell us something? 
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;


