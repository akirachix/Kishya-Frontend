'use client';
import { useState, useEffect } from 'react';
import SearchBar from '../SearchBar';
import { useFetchLocationData } from '../../hooks/useFetchLocationData';
import FloodRiskLegend from '../Legend';
import MapComponent from '../MapComponent';
import InfoPanel from '../InfoPanel';
import { ToastContainer, toast } from 'react-toastify'; 
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import FeedbackForm from '../FeedbackForm';
import 'react-toastify/dist/ReactToastify.css'; 
import { FloodRiskData } from '../../hooks/useFloodRiskData';
import { getMarkerColor } from '../../utils/floodRiskColors';




const MapDisplay = () => {
    const [location, setLocation] = useState('');
    const [searchAttempted, setSearchAttempted] = useState(false);
    const { data, error, loading } = useFetchLocationData(location, searchAttempted);
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
    const [isPanelMinimized, setIsPanelMinimized] = useState(true);
    const [isFeedbackFormVisible, setFeedbackFormVisible] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [shouldPanelBeOpen, setShouldPanelBeOpen] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState<'short_rains' | 'long_rains' | 'long_dry_season' | 'short_dry_season'>('short_rains');


  
    useEffect(() => {
        if (searchError) {
            toast.error(searchError);
            setSearchError('');
        }
    }, [searchError]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]); 



    const handleOpenFeedbackForm = () => {
        setFeedbackFormVisible(true);
    };

    const handleCloseFeedbackForm = () => {
        setFeedbackFormVisible(false);
    };

    const handlePanelToggle = () => {
        setIsPanelMinimized(!isPanelMinimized);
    };

  
    const hideUIElements = () => {
        document.getElementById('info-panel')?.classList.add('hidden');
        document.getElementById('search-bar')?.classList.add('hidden');
        document.getElementById('legend')?.classList.add('hidden');
    };

    const showUIElements = () => {
        document.getElementById('info-panel')?.classList.remove('hidden');
        document.getElementById('search-bar')?.classList.remove('hidden');
        document.getElementById('legend')?.classList.remove('hidden');
    };



    
    const handleDownload = async () => {
        const doc = new jsPDF();
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            toast.error('Map not found for download.');
            return;
        }


        const uiElements = [
            document.getElementById('search-bar'),
            document.getElementById('info-panel'),
            document.getElementById('legend')
        ];
    
        uiElements.forEach(element => {
            if (element) {
                element.style.display = 'none';
            }
        });
    
     
        hideUIElements();

        try {
            const canvas = await html2canvas(mapElement, { useCORS: true, scale:2});
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 10, 10, 180, (180 * canvas.height) / canvas.width);
            doc.setFont("poppins", "bold");
            doc.setFontSize(16);
            doc.text('Flood Risk Information', 10, 120);

            const locationInfo: FloodRiskData = data || {
                location: "",
                risk_percentage: {
                    short_rains: 0,
                    long_rains: 0,
                    long_dry_season: 0,
                    short_dry_season: 0,
                },
                soil_type: "",
                elevation: 0,
                risk_category: "",
                geometry: {
                    location: { lat: -1.286389, lng: 36.817223 }
                },
                seasonal_information: {
                    short_rains: { risk_category: "", additional_information: "" },
                    long_rains: { risk_category: "", additional_information: "" },
                    long_dry_season: { risk_category: "", additional_information: "" },
                    short_dry_season: { risk_category: "", additional_information: "" },
                },
                map_url: "",
                mapInfo: {
                    totalLandArea: "Nairobi has a total Land area of 696km²",
                    averageAnnualRainfall: "Nairobi receives 1740mm -1940mm annually on average",
                    disclaimer: "Disclaimer: LandVista provides general flood risk guidance based on current data. For critical property decisions, consult qualified local experts. This information does not replace professional surveys or guarantee outcomes. Use responsibly and exercise personal judgment when making important decisions."
                }
            };


            const textStartY = 130;
            doc.setFontSize(12);
            doc.setFont("poppins", "normal");
            let currentY = textStartY;

            doc.text(`Location: ${locationInfo.location}`, 10, currentY);
            currentY += 10; // Move down for the next line
            doc.text(`Soil Type: ${locationInfo.soil_type}`, 10, currentY);
            currentY += 10;
            doc.text(`Elevation: ${locationInfo.elevation} meters`, 10, currentY);
            currentY += 15; 

            const seasons: Array<'short_rains' | 'long_rains' | 'long_dry_season' | 'short_dry_season'> = ['short_rains', 'long_rains', 'long_dry_season', 'short_dry_season'];

            seasons.forEach((season) => {
                const riskPercentage = locationInfo.risk_percentage[season];
                const riskCategory = locationInfo.seasonal_information[season].risk_category;
                const additionalInfo = locationInfo.seasonal_information[season].additional_information;
                
                doc.text(`${season.replace(/_/g, ' ').toUpperCase()}:`, 10, currentY);
                const markerColor = getMarkerColor(riskPercentage);
                doc.setTextColor(markerColor); 

                doc.text(`Risk Percentage: ${riskPercentage}%`, 10, currentY + 10);
                doc.setTextColor(0);
                
                const riskCategoryColor = getMarkerColor(riskPercentage);
                doc.setTextColor(riskCategoryColor);
                doc.text(`Risk Category: ${riskCategory}`, 10, currentY + 20);
                doc.setTextColor(0); 
    
                const additionalInfoLines = doc.splitTextToSize(additionalInfo, 180);
                additionalInfoLines.forEach((line: string, index: number) => {
                    doc.text(line, 10, currentY + 30 + (index * 10));
                });
    
                currentY += 30 + (additionalInfoLines.length * 10); 

             if (currentY > 250) {
                doc.addPage();
                currentY = 20; 
            }
        });

        doc.setFontSize(13);
        doc.setTextColor(40);
        const disclaimerLines = doc.splitTextToSize(locationInfo.mapInfo?.disclaimer || "Disclaimer: LandVista provides general flood risk guidance based on current data. For critical property decisions, consult qualified local experts. This information does not replace professional surveys or guarantee outcomes. Use responsibly and exercise personal judgment when making important decisions.", 180);
        disclaimerLines.forEach((line: string, index: number) => {
            doc.text(line, 10, currentY + (index * 10));
        });

            doc.save('Kishya Flood Risk Report.pdf');
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            console.error('Error creating PDF:', error);
            toast.error('Failed to download PDF. Please try again.');
        } finally {
            uiElements.forEach(element => {
                if (element) {
                    element.style.display = ''; 
                }
            });
            showUIElements();
        }
    };

    const handleSearch = (location: string) => {
        setLocation(location);
        setSearchError('');
        setShouldPanelBeOpen(true);
        setIsPanelMinimized(false); 
        setSearchAttempted(true);
    };



    return (
        <div id="map" className="flex flex-col h-screen overflow-hidden">
            <div className={`absolute top-4 left-4 right-4 flex items-center`}>
                <div className="flex-1 flex justify-center items-center" id="search-bar">
                    <SearchBar onSearch={handleSearch} onError={setSearchError} />
                    {loading && (
                        <p className="fixed top-35 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded shadow-lg z-50">
                            Please hold on...
                        </p>
                    )}
                </div>

                <div className="flex space-x-4">
             </div>
             </div>

       
            <InfoPanel
                location={data?.location || "Nairobi"}
                soilType={data?.soil_type || "Nitisols"}
                elevation={data?.elevation || 0}
                floodRiskPercentage={data?.risk_percentage[selectedSeason] || 0}
                additionalInfo={data?.seasonal_information[selectedSeason]?.additional_information || ""}
                mapInfo={{
                    totalLandArea: data?.mapInfo?.totalLandArea || "696 km²",
                    averageAnnualRainfall: data?.mapInfo?.averageAnnualRainfall || "1,740 mm - 1,940 mm",
                    disclaimer: data?.mapInfo?.disclaimer || "LandVista provides general flood risk guidance based on current data. For critical property decisions, consult qualified local experts. This information does not replace professional surveys or guarantee outcomes. Use responsibly and exercise personal judgment when making important decisions."
                }}
                handleDownload={handleDownload}
                isSmallScreen={isSmallScreen}
                isPanelMinimized={isPanelMinimized}
                shouldPanelBeOpen={shouldPanelBeOpen} 
                handlePanelToggle={handlePanelToggle}
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
                loading={loading}
                onOpenFeedback={handleOpenFeedbackForm}
            />

<MapComponent
      locations={data?.geometry?.location ? [data.geometry.location] : []}
      center={{
          lat: data?.geometry?.location?.lat || -1.286389,
          lng: data?.geometry?.location?.lng || 36.817223,
      }}
      zoom={12}
      isSmallScreen={isSmallScreen}
      boundary={data?.geometry?.bounds ? [
          { lat: data.geometry.bounds.southwest.lat, lng: data.geometry.bounds.southwest.lng },
          { lat: data.geometry.bounds.southwest.lat, lng: data.geometry.bounds.northeast.lng },
          { lat: data.geometry.bounds.northeast.lat, lng: data.geometry.bounds.northeast.lng },
          { lat: data.geometry.bounds.northeast.lat, lng: data.geometry.bounds.southwest.lng },
      ] : []}
      searchedLocation={data?.geometry?.location}
      floodRiskPercentage={data?.risk_percentage[selectedSeason] || 0}
      viewport={data?.geometry?.viewport} 
      searchLocation={''}            
/>


                
            <FloodRiskLegend id="legend" isSmallScreen={isSmallScreen} />

            
            <ToastContainer 
                position="top-right" 
                autoClose={2000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick 
                rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
                className="fixed top-4 right-4 z-50"
            />
            {isFeedbackFormVisible && <FeedbackForm onClose={handleCloseFeedbackForm} />}
        </div>
    );
};

export default MapDisplay;
