import React from 'react';
import { FloodRiskData } from '../../hooks/useFloodRiskData';

interface DownloadButtonProps {
  data: FloodRiskData | null; 
  disabled: boolean; 
  handleDownload: () => Promise<void>; 
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ disabled, handleDownload }) => {
  
  return (
    <button 
      onClick={handleDownload} 
      disabled={disabled} 
      className={`bg-custom-dark-orange text-white px-4 py-2 rounded-full flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      Download PDF
    </button>
  );
};

export default DownloadButton;
