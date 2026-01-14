import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          {/* Spinning ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-[#1A5EDB] rounded-full animate-spin"></div>
          {/* Inner pulsing dot */}
          <div className="absolute inset-[35%] bg-linear-to-br from-[#1A5EDB] to-[#4A8EFF] rounded-full animate-pulse"></div>
        </div>
        <p className="text-xl font-semibold text-gray-700 animate-pulse">{message}</p>
        <div className="flex justify-center gap-1 mt-4">
          <span className="w-2 h-2 bg-[#1A5EDB] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 bg-[#1A5EDB] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 bg-[#1A5EDB] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
