import { useState, useEffect } from 'react';
import { FloodRiskData } from './useFloodRiskData';

export const useFetchLocationData = (location: string, searchAttempted: boolean) => {
    const [data, setData] = useState<FloodRiskData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [waitMessage, setWaitMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!location) {
            if (searchAttempted) {
                setError('Location is required.');
            }
            setData(null);
            setLoading(false);
            setWaitMessage(null);
            return;
        }
        
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setWaitMessage(null);


            const timer = setTimeout(() => {
                setWaitMessage('Fetching location is taking longer than expected. Please wait a little longer...')
            }, 3000)
            try {
                const response = await fetch(`/api/inputLocation?location=${location}/`);
          
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Oops! It seems like the location is not available now. Try one of these instead: Jamhuri, Kitisuru, Roysambu, or Kibera');
                    } else {
                        throw new Error('Failed to fetch data. Please try again later.');
                    }
                }
                
                const result: FloodRiskData = await response.json();
                setData(result);
            } catch (err) {
                
                if (err instanceof TypeError) {
                    setError('Network error. Please check your internet connection.');
                } else {
                    setError((err as Error).message);
                }
            } finally {
                setLoading(false);
                clearTimeout(timer);
                setWaitMessage(null);
            }
        };

        fetchData();
    }, [location, searchAttempted]);

    return { data, error, loading, waitMessage };
};







