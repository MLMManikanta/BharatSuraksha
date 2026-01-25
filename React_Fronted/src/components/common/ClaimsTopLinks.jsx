import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { to: '/utilities/e-card', label: 'E-CARD', icon: '📇' },
  { to: '/utilities/hospitals', label: 'HOSPITALS', icon: '🏥' },
  { to: '/utilities/justification-letter', label: 'LETTER', icon: '📄' },
  { to: '/utilities/claim-instructions', label: 'INSTRUCTIONS', icon: '📘' },
];

const ClaimsTopLinks = () => {
  return (
    <nav 
      className="bg-[#f8fafc] border-b border-slate-200 no-print" 
      aria-label="Claims Utilities"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Increased vertical padding (py-4) to double the bar height */}
        <div className="flex items-center justify-end gap-x-8 py-4">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                relative group flex items-center gap-3 py-2 transition-all duration-200
                ${isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Increased icon container size to match the height increase */}
                  <span 
                    className={`
                      flex items-center justify-center w-7 h-7 rounded-lg text-sm transition-colors
                      ${isActive ? 'bg-blue-100 text-blue-600 shadow-sm' : 'bg-slate-200/50 text-slate-500'}
                    `} 
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                  
                  {/* Small, bold label with normal tracking */}
                  <span className="text-[11px] font-black uppercase tracking-normal">
                    {label}
                  </span>

                  {/* Active indicator bar - positioned at the very bottom of the nav */}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-[17px] left-0 right-0 h-[3px] bg-blue-600 rounded-t-full"
                      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ClaimsTopLinks;