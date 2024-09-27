import React, { useState } from 'react';
import { toast } from 'react-toastify';
import usePostFeedback from '../../hooks/usePostFeedback';

const questions: Record<number, string> = {
    1: "Would you recommend our services to friends and family?",
    2: "Do you think the information you have gotten will help you in making an informed decision?",
    3: "Did you find LandVista's features and language easy to understand?",
};

const FeedbackForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [responses, setResponses] = useState<{ [key: number]: { question: string; positive: number; negative: number } }>({
        1: { question: questions[1], positive: 0, negative: 0 },
        2: { question: questions[2], positive: 0, negative: 0 },
        3: { question: questions[3], positive: 0, negative: 0 },
    });

    const { postFeedback, loading } = usePostFeedback();

    const handleResponseChange = (questionId: number, value: 'yes' | 'no') => {
        setResponses(prev => ({
            ...prev,
            [questionId]: {
                question: questions[questionId],
                positive: value === 'yes' ? 1 : 0,
                negative: value === 'no' ? 1 : 0,
            },
        }));
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const feedbackData = {
            1: responses[1],
            2: responses[2],
            3: responses[3],
        };

        try {
            await postFeedback(feedbackData);
            toast.success('Thank you for your feedback! 😊');
            setResponses({
                1: { question: questions[1], positive: 0, negative: 0 },
                2: { question: questions[2], positive: 0, negative: 0 },
                3: { question: questions[3], positive: 0, negative: 0 },
            });
            onClose();
        } catch (error) {
            toast.error('Failed to submit feedback.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Your Feedback</h2>

                <form onSubmit={handleFeedbackSubmit}>
                    {[1, 2, 3].map(num => (
                        <div key={num} className="mb-4">
                            <p>{responses[num].question}</p>
                            <label>
                                <input
                                    type="radio"
                                    name={`question${num}`}
                                    value="yes"
                                    checked={responses[num].positive === 1}
                                    onChange={() => handleResponseChange(num, 'yes')}
                                /> Yes
                            </label>
                            <label className="ml-4">
                                <input
                                    type="radio"
                                    name={`question${num}`}
                                    value="no"
                                    checked={responses[num].negative === 1}
                                    onChange={() => handleResponseChange(num, 'no')}
                                /> No
                            </label>
                        </div>
                    ))}

                    <div className="flex justify-between mt-4">
                        <button type="submit" disabled={loading} className="p-2 bg-blue-500 text-white rounded">
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>

                        <button type="button" onClick={onClose} className="p-2 bg-gray-300 text-black rounded">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FeedbackForm;
// import React, { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import usePostFeedback from '../../hooks/usePostFeedback';

// const questions: Record<number, string> = {
//     1: "Would you recommend our services to friends and family?",
//     2: "Do you think the information you have gotten will help you in making an informed decision?",
//     3: "Did you find LandVista's features and language easy to understand?",
// };

// const FeedbackForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//     const [responses, setResponses] = useState<{ [key: number]: { question: string; positive: number; negative: number } }>({
//         1: { question: questions[1], positive: 0, negative: 0 },
//         2: { question: questions[2], positive: 0, negative: 0 },
//         3: { question: questions[3], positive: 0, negative: 0 },
//     });

//     const { postFeedback, loading } = usePostFeedback();

//     const handleResponseChange = (questionId: number, value: 'yes' | 'no') => {
//         setResponses(prev => ({
//             ...prev,
//             [questionId]: {
//                 question: questions[questionId],
//                 positive: value === 'yes' ? 1 : 0,
//                 negative: value === 'no' ? 1 : 0,
//             },
//         }));
//     };

//     const handleFeedbackSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         const feedbackData = {
//             1: responses[1],
//             2: responses[2],
//             3: responses[3],
//         };

//         try {
//             await postFeedback(feedbackData);
//             toast.success('Thank you for your feedback!');
//             setResponses({
//                 1: { question: questions[1], positive: 0, negative: 0 },
//                 2: { question: questions[2], positive: 0, negative: 0 },
//                 3: { question: questions[3], positive: 0, negative: 0 },
//             });
//             onClose();
//         } catch (error) {
//             toast.error('Failed to submit feedback.');
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//                 <h2 className="text-lg font-bold mb-4">Your Feedback</h2>

//                 <form onSubmit={handleFeedbackSubmit}>
//                     {[1, 2, 3].map(num => (
//                         <div key={num} className="mb-4">
//                             <p>{responses[num].question}</p>
//                             <label>
//                                 <input
//                                     type="radio"
//                                     name={`question${num}`}
//                                     value="yes"
//                                     checked={responses[num].positive === 1}
//                                     onChange={() => handleResponseChange(num, 'yes')}
//                                 /> Yes
//                             </label>
//                             <label className="ml-4">
//                                 <input
//                                     type="radio"
//                                     name={`question${num}`}
//                                     value="no"
//                                     checked={responses[num].negative === 1}
//                                     onChange={() => handleResponseChange(num, 'no')}
//                                 /> No
//                             </label>
//                         </div>
//                     ))}

//                     <div className="flex justify-between mt-4">
//                         <button type="submit" disabled={loading} className="p-2 bg-blue-500 text-white rounded">
//                             {loading ? 'Submitting...' : 'Submit'}
//                         </button>

//                         <button type="button" onClick={onClose} className="p-2 bg-gray-300 text-black rounded">
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//             <ToastContainer
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 closeOnClick
//                 draggable
//                 pauseOnHover
//                 style={{
//                     zIndex: 1000,
//                     position: 'absolute',
//                     top: '20px',
//                     right: '20px',
//                 }}
//             />
//         </div>
//     );
// };

// export default FeedbackForm;
