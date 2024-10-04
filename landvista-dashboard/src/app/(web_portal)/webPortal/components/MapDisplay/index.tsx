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

interface MapInfo {
    totalLandArea: string;
    averageAnnualRainfall: string;
    disclaimer: string;
}

interface FloodRiskData {
    location: string;
    soil_type: string;
    elevation: number;
    risk_percentage: number;
    risk_category: string;
    additional_information: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        bounds?: {
            southwest: { lat: number; lng: number };
            northeast: { lat: number; lng: number };
        };
    };
    mapInfo?: MapInfo; 
}

const MapDisplay = () => {
    const [location, setLocation] = useState('');
    const { data, error, loading } = useFetchLocationData(location);
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
    const [isPanelMinimized, setIsPanelMinimized] = useState(true);
    const [isFeedbackFormVisible, setFeedbackFormVisible] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [shouldPanelBeOpen, setShouldPanelBeOpen] = useState(false);
    const floodRiskPercentage = data?.risk_percentage || 0;
  
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

     
        hideUIElements();

        try {
            const canvas = await html2canvas(mapElement, { useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 10, 10, 180, 100);
            doc.setFont("poppins", "bold");
            doc.setFontSize(16);
            doc.text('Location Information', 10, 120);

            const locationInfo: FloodRiskData = data || {
                location: "",
                soil_type: "",
                elevation: 0,
                risk_percentage: 0,
                risk_category: "",
                additional_information: "",
                geometry: {
                    location: { lat: -1.286389, lng: 36.817223 }
                },
                mapInfo: {
                    totalLandArea: "Nairobi has a total Land area of 696km²",
                    averageAnnualRainfall: "Nairobi receives 1740mm -1940mm annually on average",
                    disclaimer: "LandVista provides general flood risk guidance based on current data. For critical property decisions, consult qualified local experts. This information does not replace professional surveys or guarantee outcomes. Use responsibly and exercise personal judgment when making important decisions."
                }
            };

           
            doc.setFontSize(12);
            doc.setFont("poppins", "normal");
            doc.text(`Location: ${locationInfo.location}`, 10, 130);
            doc.text(`Soil Type: ${locationInfo.soil_type}`, 10, 140);
            doc.text(`Elevation: ${locationInfo.elevation} meters`, 10, 150);
            doc.text(`Flood Risk Percentage: ${locationInfo.risk_percentage}%`, 10, 160);
            doc.text(`Risk Category: ${locationInfo.risk_category}`, 10, 170);

            const additionalInfoLines = doc.splitTextToSize(locationInfo.additional_information, 180);
            additionalInfoLines.forEach((line: string, index: number) => {
                doc.text(line, 10, 180 + (index * 10));
            });

            doc.setFontSize(10);
            doc.setTextColor(150);
            const disclaimerLines = doc.splitTextToSize(locationInfo.mapInfo?.disclaimer || "LandVista provides general flood risk guidance based on current data. For critical property decisions, consult qualified local experts. This information does not replace professional surveys or guarantee outcomes. Use responsibly and exercise personal judgment when making important decisions.", 180);
            disclaimerLines.forEach((line: string, index: number) => {
                doc.text(line, 10, 210 + (additionalInfoLines.length * 10) + (index * 10));
            });

            doc.save('Kishya Flood Risk Report.pdf');
            toast.success('PDF downloaded successfully!');
        } catch (error) {
            console.error('Error creating PDF:', error);
            toast.error('Failed to download PDF. Please try again.');
        } finally {
          
            showUIElements();
        }
    };

    const handleSearch = (location: string) => {
        setLocation(location);
        setSearchError('');
        setShouldPanelBeOpen(true);
        setIsPanelMinimized(false); 
    };
    return (
        <div id="map" className="flex flex-col h-screen overflow-hidden">
            <h1>Flood Risk Information</h1>
            <div className={`absolute top-4 left-4 right-4 flex items-center`}>
                <div className="flex-1 flex justify-center items-center" id="search-bar">
                    <SearchBar onSearch={handleSearch} onError={setSearchError} />
                    {loading && (
                        <p className="fixed top-35 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded shadow-lg z-50">
                            Searching...
                        </p>
                    )}
                </div>
            </div>

       
            <InfoPanel
                location={data?.location || "Nairobi"}
                soilType={data?.soil_type || "Clay"}
                elevation={data?.elevation || 0}
                floodRiskPercentage={data?.risk_percentage || 0}
                additionalInfo={data?.additional_information || ""}
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
                floodRiskPercentage={floodRiskPercentage} 
                searchLocation={''}            />
            <FloodRiskLegend id="legend" isSmallScreen={isSmallScreen} />

            
            <ToastContainer 
                position="top-right" 
                autoClose={5000} 
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
