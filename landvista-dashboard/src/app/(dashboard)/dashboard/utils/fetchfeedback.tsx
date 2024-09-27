export const fetchFeedback = async (filter: string) => {
  try {
    const response = await fetch(`/api/feedback?filter=${filter}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};
