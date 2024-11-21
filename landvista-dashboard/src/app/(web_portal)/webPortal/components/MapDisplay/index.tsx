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

        doc.setFont("poppins", "normal");


        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        const brandPrimaryColor = "#008080";
        const brandSecondaryColor = "#D0E6F7";

        doc.setFillColor(brandSecondaryColor);
        doc.rect(0, 0, pageWidth, 50, 'F');

        doc.setFont("poppins", "bold");
        doc.setFontSize(30);
        const title = "LandVista Flood Risk Report";

        doc.setTextColor(brandPrimaryColor);
        const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(title, titleX, 40);

        doc.setTextColor(0)

        const logoUrl = "/media/landvista.png";
        const logoWidth = 50;
        const logoHeight = 50;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logoUrl, 'PNG', logoX, 60, logoWidth, logoHeight);


        doc.setFont("poppins", "normal");
        doc.setFontSize(14);
        const description = `LandVista provides reliable flood risk data and analytics to support informed decision-making. Our platform offers insights on seasonal risks, soil types, elevation, and more to help individuals and organizations assess flood vulnerability in their areas of interest.`;
        const descriptionLines = doc.splitTextToSize(description, 180);
        const currentY = 140;
        descriptionLines.forEach((line: string, index: number) => {
            const lineWidth = doc.getStringUnitWidth(line) * doc.getFontSize() / doc.internal.scaleFactor;
            const lineX = (pageWidth - lineWidth) / 2;
            doc.text(line, lineX, currentY + (index * 10));
        });

        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString();
        const timeStr = currentDate.toLocaleTimeString();

        doc.setFontSize(12);

        // const dateWidth = doc.getStringUnitWidth(dateStr) * doc.getFontSize() / doc.internal.scaleFactor;
        const timeWidth = doc.getStringUnitWidth(timeStr) * doc.getFontSize() / doc.internal.scaleFactor;

        const leftMargin = 10;
        const rightMargin = pageWidth - timeWidth - 23;

        doc.setFont("poppins", "bold");
        doc.setTextColor("#008080")
        doc.text("Report Date:", leftMargin, currentY + (descriptionLines.length * 10) + 20);

        
        doc.setTextColor(0)
        doc.setFont("poppins", "normal");
        doc.text(dateStr, leftMargin + doc.getStringUnitWidth("Report Date: ") * doc.getFontSize() / doc.internal.scaleFactor + 5, currentY + (descriptionLines.length * 10) + 20);

        doc.setTextColor("#008080")
        doc.setFont("poppins", "bold");
        doc.text("Time:", rightMargin - doc.getStringUnitWidth("Time: ") * doc.getFontSize() / doc.internal.scaleFactor, currentY + (descriptionLines.length * 10) + 20);


        doc.setTextColor(0)
        doc.setFont("poppins", "normal");
        doc.text(timeStr, rightMargin, currentY + (descriptionLines.length * 10) + 20);


        doc.setLineWidth(0.5);
        doc.setDrawColor(brandPrimaryColor);
        doc.line(10, 190, pageWidth - 10, 190);

        const disclaimer = `Disclaimer: LandVista provides general flood risk guidance based on current data. For critical property decisions, consult qualified local experts. This information does not replace professional surveys or guarantee outcomes. Use responsibly and exercise personal judgment when making important decisions.`;

        const disclaimerLines = doc.splitTextToSize(disclaimer, 180);

        doc.setFontSize(13);
        doc.setTextColor(40); 
        doc.setFont("poppins", "italic"); 

        const disclaimerY = currentY + (descriptionLines.length * 10) + 40;

        disclaimerLines.forEach((line: string, index: number) => {
            const lineY = disclaimerY + (index * 10); 
            const lineWidth = doc.getStringUnitWidth(line) * doc.getFontSize() / doc.internal.scaleFactor;
            const lineX = (pageWidth - lineWidth) / 2; 

            doc.text(line, lineX, lineY);
        });

        doc.setFont("poppins", "italic", "bold");
        doc.setFontSize(20);
        const slogan = "We Lead, Safety Follows";
        doc.setTextColor(brandPrimaryColor);
        const sloganWidth = doc.getStringUnitWidth(slogan) * doc.getFontSize() / doc.internal.scaleFactor;
        const sloganX = (pageWidth - sloganWidth) / 2; 
        const sloganY = pageHeight - 40;  
        doc.text(slogan, sloganX, sloganY);


        doc.setTextColor(0)

        doc.addPage();


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
            const canvas = await html2canvas(mapElement, { useCORS: true, scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 10, 10, 180, (180 * canvas.height) / canvas.width);
            doc.setFont("poppins", "bold");
            doc.setFontSize(16);

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
            currentY += 10; 
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

            doc.addPage();

            doc.setFont("poppins", "bold");
            doc.setFontSize(18);
             doc.setTextColor(brandPrimaryColor);
            doc.text("Contact Us", pageWidth / 2 - 30, 30); 
           

            doc.setFont("poppins", "normal");
            doc.setFontSize(12);
            doc.setTextColor(0);


            const emailTitle = "Email:";
            const emailContent = "kishya@gmail.com";
            doc.setFont("poppins", "bold");
            doc.text(emailTitle, 10, 50);
            doc.setFont("poppins", "normal");
            doc.text(emailContent, 10, 60);


            const phoneTitle = "Phone:";
            const phoneContent = "(+256) 787 635 823 / (+254) 759 404 025";
            doc.setFont("poppins", "bold");
            doc.text(phoneTitle, 10, 80);
            doc.setFont("poppins", "normal");
            doc.text(phoneContent, 10, 90);

        
            const websiteTitle = "Website:";
            const websiteContent = "https://landvista-informationalwebsite.vercel.app/";
            doc.setFont("poppins", "bold");
            doc.text(websiteTitle, 10, 110);
            doc.setFont("poppins", "normal");
            doc.text(websiteContent, 10, 120);

            doc.setLineWidth(0.5);
            doc.setDrawColor(brandPrimaryColor);
            doc.line(10, 135, pageWidth - 10, 135); 



            doc.setFont("poppins", "italic", "bold");
            doc.setFontSize(20);

            doc.setFont("poppins", "italic", "bold");
            doc.setFontSize(20);
            const slogan = "We Lead, Safety Follows";
            doc.setTextColor(brandPrimaryColor);
            const sloganWidth = doc.getStringUnitWidth(slogan) * doc.getFontSize() / doc.internal.scaleFactor;
            const sloganX = (pageWidth - sloganWidth) / 2; 
            const sloganY = pageHeight - 40;  
            doc.text(slogan, sloganX, sloganY);


            doc.save('LandVista Flood Risk Report.pdf');
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
