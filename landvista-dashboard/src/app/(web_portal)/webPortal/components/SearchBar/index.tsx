import React, { useState, useEffect } from 'react';

interface SearchBarProps {
    onSearch: (location: string) => void;
    onError: (error: string) => void;
}

    const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onError }) => { 
    const [input, setInput] = useState('');
    const [isSmallScreen, setIsSmallScreen] = useState(false); 
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    

    const locations = ['Kibera', 'Jamhuri', 'Roysambu', 'Kitisuru'];

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        if (input.trim()){
            const filtered = locations.filter(location =>
                location.toLowerCase().includes(input.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else{
            setFilteredSuggestions([]);
        }
    }, [input])


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
            onError(''); 
            setFilteredSuggestions([]);
        } else {
            onError('Location is required.'); 
        }
    };


    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
        onSearch(suggestion)
        setFilteredSuggestions([]);
        setTimeout(() => setFilteredSuggestions([]), 0);
    }

    return (
        <div id='search-bar' className={`absolute top-0 left-4 right-4 flex items-center ${isSmallScreen ? 'mt-0' : 'mt-[20px]'}`}>
            <div className="flex-1 flex justify-center items-center">
                <form onSubmit={handleSubmit} className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md z-20 mt-5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter location"
                        className="w-full px-4 py-2 border-2 border-teal-600 rounded-full"
                    />
                    <button type="submit" className='absolute right-3 top-2.5 text-teal-600'>
                        Search
                    </button>
                </form>

                {filteredSuggestions.length > 0 && (
                     <ul className="absolute bg-white border border-teal-600 rounded-lg mt-[210px] w-full max-w-md z-30">
                     {filteredSuggestions.map((suggestion, index) => (
                         <li
                             key={index}
                             className="px-4 py-2 cursor-pointer hover:bg-teal-100"
                             onClick={() => handleSuggestionClick(suggestion)}
                         >
                             {suggestion}
                         </li>
                     ))}
                 </ul>
                )
                }
            </div>
        </div>
    );
};

export default SearchBar;

