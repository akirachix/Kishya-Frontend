import React, { useState, useEffect } from 'react';

interface SearchBarProps {
    onSearch: (location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [input, setInput] = useState('');
    const [isSmallScreen, setIsSmallScreen] = useState(false); // Initialize as false

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
           
        }
    };

    return (
        <div id='search-bar' className={`absolute top-0 left-4 right-4 flex items-center ${isSmallScreen ? 'mt-0' : ''}`}>
            <div className="flex-1 flex justify-center items-center">
                <form onSubmit={handleSubmit} className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20 mt-5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter ward name"
                        className="w-full px-4 py-2 border-2 border-teal-600 rounded-full"
                    />
                    <button type="submit" className='absolute right-3 top-2.5 text-teal-600'>
                        Search
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SearchBar;
