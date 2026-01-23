import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FamilyPlanReview = ({ data, onChange }) => {
const navigate = useNavigate();
const siValue = data?.sumInsured?.value || 0;
const siLabel = data?.sumInsured?.label || "₹10L";


  const MATERNITY_LIMITS = {
    1000000: { limit: 75000, display: '₹75,000', riderCost: 75000 },    
    1500000: { limit: 75000, display: '₹75,000', riderCost: 75000 },     
    2000000: { limit: 100000, display: '₹1,00,000', riderCost: 100000 }, 
    2500000: { limit: 100000, display: '₹1,00,000', riderCost: 100000 },  
    5000000: { limit: 200000, display: '₹2,00,000', riderCost: 200000 },  
    10000000: { limit: 200000, display: '₹2,00,000', riderCost: 200000 }  
  };

  const getMaternityLimit = () => {
    const si = siValue;
    if (si <= 1000000) return MATERNITY_LIMITS[1000000];
    if (si <= 1500000) return MATERNITY_LIMITS[1500000];
    if (si <= 2000000) return MATERNITY_LIMITS[2000000];
    if (si <= 2500000) return MATERNITY_LIMITS[2500000];
    if (si <= 5000000) return MATERNITY_LIMITS[5000000];
    return MATERNITY_LIMITS[10000000];
  };

  // Check maternity eligibility - requires both Self AND Spouse
  const memberCounts = data?.counts || {};
  const hasSelf = Number(memberCounts.self || 0) > 0;
  const hasSpouse = Number(memberCounts.spouse || 0) > 0;
  const isMaternityEligible = hasSelf && hasSpouse;

  const maternityInfo = getMaternityLimit();

  // --- 1. RIDER STATES ---
  const [roomRiderActive, setRoomRiderActive] = useState(false);
  const [selectedRoomLimit, setSelectedRoomLimit] = useState("Single Private Room");
  const [airAmbulanceActive, setAirAmbulanceActive] = useState(false);

  // --- 2. DYNAMIC PRICING LOGIC & NOTIFY PARENT ---
  useEffect(() => {
    // Build riders array for PaymentSummary
    const activeRiders = [];
    if (airAmbulanceActive) {
      activeRiders.push({ id: 'air_ambulance', name: 'Air Ambulance', active: true });
    }
    
    // Notify parent of changes so PaymentSummary updates
    if (onChange) {
      onChange({
        riders: activeRiders,
        isRoomRentCapped: roomRiderActive,
        roomRentLimit: roomRiderActive ? selectedRoomLimit : null,
        // Pass room rent restriction for premium discount calculation
        selectedPlan: {
          ...(data?.selectedPlan || {}),
          room_rent_restriction: roomRiderActive ? selectedRoomLimit : null,
          roomRentRestriction: roomRiderActive ? selectedRoomLimit : null
        },
        optionalEnhancements: {
          roomRentRestriction: roomRiderActive,
          airAmbulance: airAmbulanceActive
        }
      });
    }
  }, [roomRiderActive, airAmbulanceActive, selectedRoomLimit, onChange, data?.selectedPlan]);

const handleBack = () => {
  navigate('/select-plan', {
    state: {
      ...data,
      activeTab: 'parivar'
    },
    replace: false
  });

  setTimeout(() => {
    navigate(0);
  }, 0);
};

  return (
    <main className="w-full font-sans animate-fade-in-up">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 rounded-t-3xl text-white shadow-lg flex justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 opacity-10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-1">Plan Review</h1>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-sm">Parivar Suraksha</span>
            <span className="text-sm font-bold opacity-90">{siLabel} Sum Insured</span>
          </div>
        </div>
        
        <button 
          onClick={handleBack} 
          aria-label="Return to previous plan selection step"
          className="relative z-10 flex items-center gap-2 px-4 py-2 text-xs font-bold text-purple-900 bg-white hover:bg-purple-50 rounded-xl transition-all shadow-md active:scale-95"
        >
          <span>←</span> Edit
        </button>
      </div>

      <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-gray-100 p-6 md:p-8 space-y-8">

        {/* CORE POLICY FACTORS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
           {/* Vertical Divider for MD+ screens */}
           <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100"></div>

           <div className="space-y-6">
              {/* ROOM RENT */}
              <article className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-xl shrink-0">🛏️</div>
                 <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Room Rent & Category</h2>
                    <p className="font-extrabold text-gray-800 text-lg">
                      {roomRiderActive ? selectedRoomLimit : "Any Private AC Room"}
                    </p>
                    <p className="text-xs text-purple-600 font-medium bg-purple-50 inline-block px-2 py-1 rounded mt-1">
                      {roomRiderActive ? "Restricted category discount applied." : "No capping on room rent."}
                    </p>
                 </div>
              </article>

              {/* CO-PAY */}
              <article className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-xl shrink-0">✅</div>
                 <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Coverage & Co-Pay</h2>
                    <p className="font-extrabold text-green-700 text-lg">0% Co-Pay (Nil)</p>
                    <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                      <li>• Modern Treatments Covered</li>
                      <li>• AYUSH Treatment Covered</li>
                      <li>• Domiciliary Treatment Covered</li>
                    </ul>
                 </div>
              </article>

              {/* MATERNITY COVERAGE - Only shown when eligible (Self + Spouse) */}
              {isMaternityEligible && (
                <article className="flex gap-4">
                   <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 bg-pink-50">🤰</div>
                   <div>
                      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Maternity Coverage</h2>
                      <p className="font-extrabold text-pink-700 text-lg">Up to {maternityInfo.display}</p>
                      <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                        <li>• Normal & C-Section Delivery</li>
                        <li>• Pre & Post Natal Expenses</li>
                        <li>• Newborn Baby Cover (90 days)</li>
                      </ul>
                   </div>
                </article>
              )}
           </div>

           <div className="space-y-6">
              {/* WAITING PERIOD STATUS */}
              <article>
                 <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Waiting Periods
                 </h2>
                 <div className="space-y-3 pl-2 border-l-2 border-gray-100 ml-1">
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">30 Days</p>
                        <p className="text-xs text-gray-500">Initial Waiting Period</p>
                    </div>
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">3 Years</p>
                        <p className="text-xs text-gray-500">Pre-Existing Diseases (PED)</p>
                    </div>
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">24 Months</p>
                        <p className="text-xs text-gray-500">Specific Slow-Growing Illnesses</p>
                    </div>
                 </div>
              </article>
           </div>
        </section>

   
  
        {/* RIDER SECTION */}
        <section aria-labelledby="riders-title" className="space-y-4">
           <h2 id="riders-title" className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              ✨ Available Riders
           </h2>
           
           <div className="grid grid-cols-1 gap-4">
              {/* 1. Room Restriction Rider */}
              <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 rounded-xl border transition-all ${roomRiderActive ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2">
                       Room Type Restriction
                       {roomRiderActive && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Discount Applied</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Opt for a restricted room type to reduce premium.</p>
                 </div>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    {roomRiderActive && (
                       <select 
                          value={selectedRoomLimit}
                          onChange={(e) => setSelectedRoomLimit(e.target.value)}
                          className="w-full md:w-auto text-xs font-bold border border-amber-300 rounded-lg p-2 bg-white text-amber-900 focus:outline-none"
                       >
                          <option value="Single Private Room">Single Private Room</option>
                          <option value="Single Private AC Room">Single Private AC</option>
                          <option value="Twin Sharing">Twin Sharing</option>
                       </select>
                    )}
                    <button 
                       onClick={() => setRoomRiderActive(!roomRiderActive)} 
                       className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${roomRiderActive ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                    >
                       {roomRiderActive ? 'Remove' : 'Select'}
                    </button>
                 </div>
              </div>

            
             

              {/* 3. Air Ambulance Rider */}
              <div className={`flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-xl border transition-all ${airAmbulanceActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 md:justify-start justify-center">
                       Air Ambulance Cover
                       {airAmbulanceActive && <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">Active</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Emergency Aero-medical evacuation coverage.</p>
                 </div>
                 <button 
                    onClick={() => setAirAmbulanceActive(!airAmbulanceActive)} 
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${airAmbulanceActive ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                 >
                    {airAmbulanceActive ? 'Remove' : 'Add'}
                 </button>
              </div>
           </div>
        </section>

        {/* EXCLUSIONS */}
        <section aria-labelledby="exclusions-heading">
           <h2 id="exclusions-heading" className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">❌ Exclusions</h2>
           <div className="flex flex-wrap gap-2">
              {/* Dynamic exclusions: Maternity & Newborn when spouse not selected */}
              {!isMaternityEligible && (
                <>
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 uppercase flex items-center gap-1">
                    🤰 Maternity Cover
                    <span className="text-[8px] text-red-500 font-normal normal-case">(Requires Self + Spouse)</span>
                  </span>
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 uppercase flex items-center gap-1">
                    👶 Newborn Baby Cover
                    <span className="text-[8px] text-red-500 font-normal normal-case">(Requires Self + Spouse)</span>
                  </span>
                </>
              )}
              {['Global Treatment', 'Cosmetic Surgery', 'Infertility / IVF', 'Adventure Sports'].map((exc, i) => (
                 <span key={i} className="text-[10px] font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 uppercase">
                    {exc}
                 </span>
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

export default FamilyPlanReview;