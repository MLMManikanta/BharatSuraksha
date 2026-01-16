// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Decor (Blobs) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="text-center relative z-10 max-w-lg mx-auto">
        
        {/* Large 404 Text */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 drop-shadow-sm mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Button */}
        <Link 
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="mr-2">🏠</span>
          Back to Home
        </Link>
      </div>

      {/* Custom Animations for the blobs */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;