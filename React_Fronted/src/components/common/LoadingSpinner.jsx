import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 w-full z-50 fixed inset-0"
      role="status"
      aria-live="polite"
    >
      <div className="text-center flex flex-col items-center">
        
        {/* Spinner Container */}
        <div className="relative w-24 h-24 mb-6">
          {/* Outer Static Ring */}
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full opacity-50"></div>
          
          {/* Spinning Ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-[#1A5EDB] rounded-full animate-spin"></div>
          
          {/* Inner Pulsing Dot */}
          <div className="absolute inset-[35%] bg-gradient-to-br from-[#1A5EDB] to-[#4A8EFF] rounded-full animate-pulse shadow-lg shadow-blue-500/30"></div>
        </div>

        {/* Loading Message */}
        <p className="text-xl font-bold text-slate-700 tracking-tight mb-2">
          {message}
        </p>

        {/* Bouncing Dots */}
        <div className="flex justify-center gap-2 mt-2">
          <span 
            className="w-2.5 h-2.5 bg-[#1A5EDB] rounded-full animate-bounce" 
            style={{ animationDelay: '0ms' }}
          ></span>
          <span 
            className="w-2.5 h-2.5 bg-[#1A5EDB] rounded-full animate-bounce" 
            style={{ animationDelay: '150ms' }}
          ></span>
          <span 
            className="w-2.5 h-2.5 bg-[#1A5EDB] rounded-full animate-bounce" 
            style={{ animationDelay: '300ms' }}
          ></span>
        </div>

      </div>
    </div>
  );
};

export default LoadingSpinner;