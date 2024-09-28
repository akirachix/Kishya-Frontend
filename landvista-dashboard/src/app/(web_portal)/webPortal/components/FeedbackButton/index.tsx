import React from 'react';
import { MessageSquare } from 'react-feather'; 

interface FeedbackButtonProps {
    onOpen: () => void; 
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onOpen }) => {
    return (
        <button 
            onClick={onOpen} 
            className="bg-custom-dark-blue text-white px-4 py-2 rounded-full flex items-center justify-center"
        >
            <MessageSquare size={24} className="mr-2" />
            Feedback
        </button>
    );
};

export default FeedbackButton;
