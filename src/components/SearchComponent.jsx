import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X } from 'lucide-react';

const SearchComponent = ({ onSearch, placeholder = "Search products..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please enable microphone access.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSearch]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleVoiceSearch = () => {
    if (!isSupported) {
      alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        alert('Could not start voice search. Please check microphone permissions.');
      }
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-3 text-gray-400">
          <Search size={20} />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#caa47c] focus:border-transparent text-gray-900"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-16 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}

        {/* Voice Search Button */}
        <button
          onClick={handleVoiceSearch}
          className={`absolute right-3 p-2 rounded-lg transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice search'}
          title={isListening ? 'Stop listening' : 'Voice search'}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 text-center">
          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Listening...</span>
          </div>
        </div>
      )}

      {/* Browser Support Warning */}
      {!isSupported && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          Voice search requires Chrome, Edge, or Safari browser
        </p>
      )}
    </div>
  );
};

export default SearchComponent;

