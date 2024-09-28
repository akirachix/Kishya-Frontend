import { useState } from 'react';
import postFeedback from '../utils/postFeedback';

const usePostFeedback = () => {
  const [loading, setLoading] = useState(false);

  const postFeedbackData = async (feedbackData: { [key: number]: { question: string; positive: number; negative: number } }) => {
    setLoading(true);
    try {
      await postFeedback(feedbackData);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  return { postFeedback: postFeedbackData, loading };
};

export default usePostFeedback;
