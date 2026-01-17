import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-4 overflow-hidden">

      {/* Background Decor (Blue Blobs) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-lg mx-auto text-center">

        {/* 404 Gradient Text */}
        <h1 className="mb-4 text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-600 drop-shadow-sm">
          404
        </h1>

        {/* Message */}
        <h2 className="mb-4 text-3xl font-bold text-gray-800">
          Oops! Page Not Found
        </h2>

        <p className="mb-8 text-lg leading-relaxed text-gray-600">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white
                     bg-linear-to-r from-blue-500 to-indigo-600
                     rounded-xl transition-all duration-200
                     hover:from-blue-600 hover:to-indigo-700
                     hover:shadow-lg hover:-translate-y-1
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="mr-2">🏠</span>
          Back to Home
        </Link>
      </div>

      {/* Blob Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
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
