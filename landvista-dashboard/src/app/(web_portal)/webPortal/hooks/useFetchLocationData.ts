
import { useState, useEffect } from 'react';
import { FloodRiskData } from './useFloodRiskData';

export const useFetchLocationData = (location: string) => {
    const [data, setData] = useState<FloodRiskData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!location) {
            setError('Location is required.');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/inputLocation?location=${location}/`);
          
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Location not found. Please try a different location.');
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
            }
        };

        fetchData();
    }, [location]);

    return { data, error, loading };
};







