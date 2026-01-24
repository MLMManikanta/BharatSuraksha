import React from 'react';
import { Link } from 'react-router-dom';

const ClaimsTopLinks = () => (
  <div className="bg-white border-b border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-wrap items-center justify-end gap-4 text-sm">
        <Link to="/utilities/e-card" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
          <span aria-hidden>🎫</span>
          <span>Download E-Card</span>
        </Link>
        <Link to="/utilities/hospitals" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
          <span aria-hidden>🏥</span>
          <span>Hospital List</span>
        </Link>
        <Link to="/utilities/justification-letter" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
          <span aria-hidden>📄</span>
          <span>Justification Letter</span>
        </Link>
        <Link to="/utilities/claim-instructions" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors">
          <span aria-hidden>📘</span>
          <span>Claim Instructions</span>
        </Link>
      </div>
    </div>
  </div>
);

export default ClaimsTopLinks;
