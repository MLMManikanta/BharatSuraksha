import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Vishwa Suraksha Maternity Cover Limits based on Sum Insured (from CSV)
const VISHWA_MATERNITY_CONFIG = {
  '50L': { limit: 100000, display: '₹1,00,000' },
  '1Cr': { limit: 200000, display: '₹2,00,000' },
  '2Cr': { limit: 200000, display: '₹2,00,000' },
  '5Cr': { limit: 250000, display: '₹2,50,000' },
  'Unlimited': { limit: 250000, display: '₹2,50,000' }
};

// Vishwa OPD Rider Options (from CSV)
const VISHWA_OPD_OPTIONS = [
  { value: '', label: 'No OPD Cover', limit: 0 },
  { value: '25k', label: '₹25,000', limit: 25000 },
  { value: '50k', label: '₹50,000', limit: 50000 },
  { value: '75k', label: '₹75,000', limit: 75000 },
  { value: '1L', label: '₹1,00,000', limit: 100000 }
];

// Helper to get coverage key from sum insured
const getCoverageKey = (si) => {
  if (!si) return '1Cr';
  let checkStr = (typeof si === 'object' ? (si.label || si.value || '') : si.toString());
  checkStr = checkStr.toLowerCase().replace(/\s/g, '');
  
  if (checkStr.includes('50l')) return '50L';
  if (checkStr.includes('1cr')) return '1Cr';
  if (checkStr.includes('2cr')) return '2Cr';
  if (checkStr.includes('5cr')) return '5Cr';
  if (checkStr.includes('unlimited') || checkStr.includes('99cr')) return 'Unlimited';
  return '1Cr';
};

const UniversalPlanReview = ({ data, onChange }) => {
  const navigate = useNavigate();
  
  // --- 1. DATA & LOGIC INITIALIZATION ---
  const siValue = data?.sumInsured?.value || 0;
  const siLabel = data?.sumInsured?.label || "";

  /** * FIXED LOGIC: We check if the label includes "Unlimited" or the value is 99Cr.
   * This ensures the Secure Benefit disappears correctly for all "Unlimited" variants.
   */
  const isUnlimited = 
    siLabel.toLowerCase().includes('unlimited') || 
    Number(siValue) >= 990000000;

  // Get maternity limit based on sum insured (from CSV data)
  const coverageKey = getCoverageKey(data?.sumInsured || siLabel);
  const maternityConfig = useMemo(() => {
    return VISHWA_MATERNITY_CONFIG[coverageKey] || VISHWA_MATERNITY_CONFIG['1Cr'];
  }, [coverageKey]);

  // --- 2. RIDER & PRICING STATES ---
  const [selectedOPD, setSelectedOPD] = useState(data?.opdRider || ''); // OPD rider selection (empty = no OPD)

  // Get selected OPD option details
  const selectedOPDOption = useMemo(() => {
    return VISHWA_OPD_OPTIONS.find(opt => opt.value === selectedOPD) || VISHWA_OPD_OPTIONS[0];
  }, [selectedOPD]);

  // --- 3. Notify parent component of OPD selection change for PaymentSummary ---
  useEffect(() => {
    if (onChange) {
      onChange({ opdRider: selectedOPD, selectedOPD: selectedOPD });
    }
  }, [selectedOPD, onChange]);

  // --- Custom listbox state (local, purely presentational) ---
  const [opdOpen, setOpdOpen] = useState(false);
  const [opdFocusIndex, setOpdFocusIndex] = useState(-1);
  const opdRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (opdRef.current && !opdRef.current.contains(e.target)) {
        setOpdOpen(false);
        setOpdFocusIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Keyboard handler for listbox navigation
  const handleOpdKeyDown = (e) => {
    const opts = VISHWA_OPD_OPTIONS;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpdOpen(true);
      setOpdFocusIndex((i) => Math.min(i + 1, opts.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpdOpen(true);
      setOpdFocusIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (opdOpen && opdFocusIndex >= 0) {
        const val = opts[opdFocusIndex].value;
        setSelectedOPD(val);
        setOpdOpen(false);
        setOpdFocusIndex(-1);
      } else {
        setOpdOpen((o) => !o);
      }
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setOpdOpen(false);
      setOpdFocusIndex(-1);
    }
  };



  const handleBack = () => {
  navigate('/select-plan', {
    state: {
      ...data,
      activeTab: 'vishwa'
    },
    replace: false
  });

  setTimeout(() => {
    navigate(0);
  }, 0);
};
  
  return (
    <main className="w-full font-sans animate-fade-in-up">
      
      {/* ELITE HEADER */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-900 p-8 rounded-t-3xl text-white shadow-2xl flex justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400 opacity-10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-100 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-500/30">
              PREMIUM ELITE
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight italic mb-1">Vishwa Suraksha</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-100 opacity-90 uppercase tracking-widest">Worldwide Protection ({siLabel})</span>
          </div>
        </div>
        
        <button 
          onClick={handleBack} 
          className="relative z-10 flex items-center gap-2 px-6 py-2.5 text-xs font-black text-emerald-900 bg-white hover:bg-emerald-50 rounded-xl shadow-lg transition-all active:scale-95"
        >
          <span>←</span> Edit
        </button>
      </div>

      <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-gray-100 p-6 md:p-8 space-y-8">
        
        {/* GLOBAL COVERAGE HIGHLIGHT */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-6 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="space-y-2 text-center md:text-left relative z-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">PRIMARY BENEFIT</h3>
            <p className="text-2xl font-black leading-tight italic">Worldwide Cashless Hospitalization</p>
            <p className="text-sm font-medium text-emerald-100 opacity-90 max-w-lg">
              Covers treatment anywhere in the world including USA & Canada with cashless facility.
            </p>
          </div>
          <div className="text-6xl relative z-10 drop-shadow-lg">🌍</div>
        </div>

        {/* CORE POLICY FACTORS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
           <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100"></div>

           <div className="space-y-6">
              {/* ROOM RENT */}
              <article className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl shrink-0">🏨</div>
                 <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Accommodation & Co-Pay</h2>
                    <p className="font-extrabold text-gray-800 text-lg">Any Room (No Limit)</p>
                    <p className="text-xs text-emerald-700 font-black uppercase bg-emerald-50 inline-block px-2 py-1 rounded mt-1">
                      0% Co-Pay Worldwide
                    </p>
                 </div>
              </article>

              {/* WAITING PERIOD STATUS */}
              <article>
                 <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Waiting Periods
                 </h2>
                 <div className="space-y-4 pl-2 border-l-2 border-gray-100 ml-1">
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">30 Days</p>
                        <p className="text-xs text-gray-500 leading-tight">Initial Waiting Period</p>
                    </div>
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">3 Years</p>
                        <p className="text-xs text-gray-500 leading-tight">Pre-Existing Diseases (PED)</p>
                    </div>
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">24 Months</p>
                        <p className="text-xs text-gray-500 leading-tight">Specific Slow-Growing Illnesses</p>
                    </div>
                 </div>
              </article>
           </div>

           <div className="space-y-6">
              {/* MATERNITY */}
              <article className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-xl shrink-0">🤰</div>
                 <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Universal Maternity</h2>
                    <p className="font-extrabold text-gray-800 text-lg">{maternityConfig.display} Limit</p>
                    <p className="text-xs text-pink-600 font-bold bg-pink-50 inline-block px-2 py-1 rounded mt-1">
                      Waiting: 2 Years
                    </p>
                 </div>
              </article>

              {/* RECOVERY & LOGISTICS */}
              <article>
                 <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span> Recovery & Logistics
                 </h2>
                 <ul className="space-y-3 text-xs font-medium text-gray-600">
                    <li className="flex items-center gap-2 bg-teal-50/50 p-2 rounded-lg border border-teal-50">
                      <span className="text-lg">🚁</span> 
                      <span className="text-teal-900 font-bold">International Air Ambulance</span>
                    </li>
                    <li className="flex items-center gap-2 px-2">
                      <span className="text-green-500">✓</span> Non-Medical Consumables (100% Covered)
                    </li>
                    <li className="flex items-center gap-2 px-2">
                      <span className="text-green-500">✓</span> Pre-Hosp: 90 Days | Post-Hosp: 180 Days
                    </li>
                 </ul>
              </article>

              {/* RENEWAL BONUS */}
              <article className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                 <h3 className="text-xs font-bold text-emerald-800 uppercase mb-1">Renewal Benefit</h3>
                 <p className="text-sm font-black text-emerald-900 italic">5x Renewal Bonus Added</p>
                 <p className="text-[10px] text-emerald-700 mt-1">Sum Insured grows up to 500% over time.</p>
              </article>
           </div>
        </section>

        {/* CONDITIONAL RESTORATION (SECURE BENEFIT) */}
        {!isUnlimited && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
             <div className="text-2xl">🛡️</div>
             <div>
                <h3 className="text-xs font-bold text-blue-800 uppercase">Secure Benefit Active</h3>
                <p className="text-sm font-bold text-slate-800">Unlimited Automatic Restoration</p>
                <p className="text-xs text-slate-500 mt-0.5">Refills instantly for related or unrelated illnesses.</p>
             </div>
          </div>
        )}

        {/* RIDER SECTION */}
        <section aria-labelledby="riders-heading" className="space-y-4">
           <h2 id="riders-heading" className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              💎 Elite Customizations
           </h2>
           
           <div className="grid grid-cols-1 gap-4">
              <div className={`flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-2xl border transition-all ${selectedOPD ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2">
                       Worldwide OPD & Wellness
                       {selectedOPD && <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">Active</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedOPD 
                        ? `Global doctor visits & prescriptions (Limit ${selectedOPDOption.label}).`
                        : 'Add global doctor visits & prescriptions coverage.'}
                    </p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="relative" ref={opdRef} onKeyDown={handleOpdKeyDown}>
                      <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={opdOpen}
                        onClick={() => { setOpdOpen(o => !o); setOpdFocusIndex(-1); }}
                        className={`w-56 text-left pl-4 pr-10 py-3 rounded-xl text-sm font-semibold transition duration-200 ease-out transform-gpu ${selectedOPD ? 'bg-emerald-800 text-white shadow-xl border-emerald-700' : 'bg-white text-emerald-900 border border-emerald-100 hover:bg-emerald-50'}`}
                      >
                        <span className="flex items-center justify-between">
                          <span className="truncate">
                            {selectedOPD ? `OPD ${selectedOPDOption.label}` : 'Select OPD Limit'}
                          </span>
                          <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${opdOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </span>
                      </button>

                      <div
                        role="listbox"
                        aria-label="OPD options"
                        tabIndex={-1}
                        className={`absolute z-50 mt-2 w-56 bg-white rounded-xl shadow-xl border border-emerald-100 ring-1 ring-black/5 py-1 max-h-56 overflow-auto focus:outline-none transition-all duration-200 ease-out transform origin-top-right ${opdOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}
                      >
                        {VISHWA_OPD_OPTIONS.map((opt, idx) => {
                          const isSelected = opt.value === selectedOPD;
                          const isFocused = idx === opdFocusIndex;
                          return (
                            <div
                              key={opt.value}
                              role="option"
                              aria-selected={isSelected}
                              onMouseEnter={() => setOpdFocusIndex(idx)}
                              onMouseLeave={() => setOpdFocusIndex(-1)}
                              onClick={() => { setSelectedOPD(opt.value); setOpdOpen(false); setOpdFocusIndex(-1); }}
                              className={`flex items-center justify-between cursor-pointer px-4 py-3 text-sm transition-colors duration-150 ease-out ${isSelected ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-gray-800 hover:bg-emerald-50'} ${isFocused ? 'bg-emerald-50' : ''}`}
                            >
                              <span className="truncate">{opt.value ? `OPD ${opt.label}` : opt.label}</span>
                              {isSelected && (
                                <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                </svg>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {selectedOPD && (
                      <button 
                        onClick={() => setSelectedOPD('')}
                        className="px-3 py-2.5 rounded-xl text-[10px] font-black bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                      >
                        Remove
                      </button>
                    )}
                 </div>
              </div>
           </div>
        </section>

        {/* GLOBAL EXCLUSIONS */}
        <section className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 text-slate-300 shadow-inner">
           <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              ❌ Universal Exclusions
           </h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {['Cosmetic Surgery', 'Self-Inflicted Injuries', 'War & Nuclear Perils', 'Unproven Treatments'].map((exc, i) => (
                 <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center text-[10px] font-bold uppercase tracking-wide hover:bg-slate-800 transition-colors cursor-default">
                    {exc}
                 </div>
              ))}
           </div>
        </section>
        
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
};

export default UniversalPlanReview;