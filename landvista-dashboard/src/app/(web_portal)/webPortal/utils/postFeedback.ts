const postFeedback = async (feedbackData: { [key: number]: { question: string; positive: number; negative: number } }) => {
    try {
        const response = await fetch(`/api/submitFeedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
            const errorDetails = await response.text(); 
            console.error('Response status:', response.status);
            console.error('Error details:', errorDetails);
            throw new Error('Failed to submit feedback');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error; 
    }
};

export default postFeedback;


















































// const postFeedback = async (feedbackData: { [key: number]: { question: string; positive: number; negative: number } }) => {
 
//hunter
//     const response = await fetch(`/api/submitFeedback`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(feedbackData),
//     });

  

//     if (!response.ok) {
//         throw new Error('Failed to submit feedback');
//     }

//     return response.json();
// };

// export default postFeedback;






// const postFeedback = async (feedbackData: { [key: number]: { question: string; positive: number; negative: number } }) => {
//     try {
//         const response = await fetch(`/api/submitFeedback`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(feedbackData),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to submit feedback');
//         }

//         return await response.json();
//     } catch (error) {
//         console.error('Error submitting feedback:', error);
//         throw error; // Re-throw the error if you want it to propagate
//     }
// };

// export default postFeedback;
//the above is mine for try and catch
