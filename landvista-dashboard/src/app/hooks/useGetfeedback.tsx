import { useState, useEffect } from 'react';
interface FeedbackItem {
  id: number;
  question: string;
  positive: number;
  negative: number;
}
export const useFeedbackData = () => {
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://landvista-add4f114223c.herokuapp.com/api/responses/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return { data, isLoading, error };
};



