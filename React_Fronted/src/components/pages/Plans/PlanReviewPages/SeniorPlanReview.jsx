import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SeniorPlanReview = ({ data }) => {
  const navigate = useNavigate();
  const basePremium = data?.basePremium || 18500;
  const siLabel = data?.sumInsured?.label || "₹5L";

  const [pedCoverActive, setPedCoverActive] = useState(false);
  const [specificIllnessRider, setSpecificIllnessRider] = useState(false);
  const [consumablesRider, setConsumablesRider] = useState(false);
  const [roomRiderActive, setRoomRiderActive] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("Single Private AC Room");
  const [selectedDeductible, setSelectedDeductible] = useState("None");
  const [copayLevel, setCopayLevel] = useState("standard"); 

  const [currentPremium, setCurrentPremium] = useState(basePremium);

  useEffect(() => {
    let total = basePremium;
    
    if (pedCoverActive) total += 4500;
    if (specificIllnessRider) total += 2200;
    if (consumablesRider) total += 1500;
    if (copayLevel === "5%") total += 2500;
    if (copayLevel === "0%") total += 5500;
    if (roomRiderActive && (selectedRoom === "Deluxe Room" || selectedRoom === "Any Room")) total += 3000;
    
    const deductibleValues = { "10k": 1000, "15k": 1500, "25k": 2500, "40k": 4000, "50k": 5000, "1L": 8000 };
    if (selectedDeductible !== "None") total -= (deductibleValues[selectedDeductible] || 0);

    setCurrentPremium(total);
  }, [pedCoverActive, specificIllnessRider, consumablesRider, copayLevel, roomRiderActive, selectedRoom, selectedDeductible, basePremium]);

  const handleBack = () => {
    navigate('/select-plan', { state: { ...data, activeTab: 'varishtha' } });
  };

  return (
    <main className="w-full font-sans animate-fade-in-up">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-700 p-8 rounded-t-3xl text-white shadow-lg flex justify-between items-start md:items-center gap-4 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-1">Plan Review</h1>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-sm">Varishtha Suraksha</span>
            <span className="text-sm font-bold opacity-90">{siLabel} Sum Insured</span>
          </div>
        </div>
        
        <button 
          onClick={handleBack} 
          aria-label="Return to previous plan selection step"
          className="relative z-10 flex items-center gap-2 px-4 py-2 text-xs font-bold text-orange-900 bg-white hover:bg-orange-50 rounded-xl transition-all shadow-md active:scale-95"
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
                 <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl shrink-0">🛏️</div>
                 <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Room Rent & Category</h2>
                    <p className="font-extrabold text-gray-800 text-lg">
                      {roomRiderActive ? selectedRoom : "Up to Single Private Room"}
                    </p>
                    <p className="text-xs text-orange-600 font-medium bg-orange-50 inline-block px-2 py-1 rounded mt-1">
                      {roomRiderActive ? "Room upgrade rider active." : "Standard coverage."}
                    </p>
                 </div>
              </article>

              {/* CO-PAY */}
              <article className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-xl shrink-0">🤝</div>
                 <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Co-Payment</h2>
                    <p className="font-extrabold text-amber-800 text-lg">
                      {copayLevel === "standard" ? "10% Standard" : copayLevel === "5%" ? "Reduced @ 5%" : "0% (Nil) Co-Pay"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Percentage you pay during a claim.</p>
                 </div>
              </article>
           </div>

           <div className="space-y-6">
              {/* WAITING PERIOD STATUS */}
              <article>
                 <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span> Waiting Periods
                 </h2>
                 <div className="space-y-3 pl-2 border-l-2 border-gray-100 ml-1">
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">30 Days</p>
                        <p className="text-xs text-gray-500">Initial Waiting Period</p>
                    </div>
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">
                          {pedCoverActive ? "Day 31 Coverage" : "3 Years"}
                        </p>
                        <p className="text-xs text-gray-500">Pre-Existing Diseases (PED)</p>
                    </div>
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">
                          {specificIllnessRider ? "12 Months" : "24 Months"}
                        </p>
                        <p className="text-xs text-gray-500">Specific Slow-Growing Illnesses</p>
                    </div>
                 </div>
              </article>
           </div>
        </section>

        {/* SENIOR BENEFITS */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-5 border border-orange-100">
           <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">👴</span>
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Premium Senior Benefits</h3>
           </div>
           <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-gray-700">
             <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Tele-OPD Consultations (24/7)</li>
             <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Domiciliary Hospitalization</li>
             <li className="flex items-center gap-2"><span className="text-green-600">✓</span> Organ Donor Expenses</li>
             <li className="flex items-center gap-2"><span className="text-green-600">✓</span> AYUSH Treatment Covered</li>
             <li className={`flex items-center gap-2 transition-colors ${consumablesRider ? "text-green-700 font-bold" : "text-gray-400"}`}>
               {consumablesRider ? "✓ Non-Medical Consumables Covered" : "○ Non-Medical Consumables (Optional)"}
             </li>
           </ul>
        </div>

        {/* RIDER SECTION */}
        <section aria-labelledby="riders-title" className="space-y-4">
           <h2 id="riders-title" className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              ✨ Available Riders
           </h2>
           
           <div className="grid grid-cols-1 gap-4">
              
              {/* RIDER 1: PED COVER */}
              <div className={`flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-xl border transition-all ${pedCoverActive ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 md:justify-start justify-center">
                       PED Waiting Reduction
                       {pedCoverActive && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Active</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Reduce waiting for chronic illnesses from 3 years to 30 days.</p>
                 </div>
                 <button onClick={() => setPedCoverActive(!pedCoverActive)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pedCoverActive ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                    {pedCoverActive ? 'Remove' : 'Add (+₹4,500)'}
                 </button>
              </div>

              {/* RIDER 2: SPECIFIC ILLNESS */}
              <div className={`flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-xl border transition-all ${specificIllnessRider ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 md:justify-start justify-center">
                       Specific Illness Reduction
                       {specificIllnessRider && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Active</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Reduce waiting for Cataract/Joints from 2 years to 1 year.</p>
                 </div>
                 <button onClick={() => setSpecificIllnessRider(!specificIllnessRider)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${specificIllnessRider ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                    {specificIllnessRider ? 'Remove' : 'Add (+₹2,200)'}
                 </button>
              </div>

              {/* RIDER 3: CO-PAY REDUCTION */}
              <div className={`flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-xl border transition-all ${copayLevel !== 'standard' ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 md:justify-start justify-center">
                       Co-pay Waiver
                       {copayLevel !== 'standard' && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Active</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Reduce standard 10% co-payment.</p>
                 </div>
                 <select 
                   value={copayLevel} 
                   onChange={(e) => setCopayLevel(e.target.value)}
                   className="text-xs font-bold border border-amber-300 rounded-lg p-2 bg-white text-amber-900 focus:outline-none"
                 >
                   <option value="standard">Standard (10%)</option>
                   <option value="5%">Reduce to 5% (+₹2,500)</option>
                   <option value="0%">Reduce to 0% (+₹5,500)</option>
                 </select>
              </div>

              {/* RIDER 4: CONSUMABLES */}
              <div className={`flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-xl border transition-all ${consumablesRider ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 md:justify-start justify-center">
                       Non-Medical Consumables
                       {consumablesRider && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Active</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Cover 60+ items like gloves/masks usually excluded.</p>
                 </div>
                 <button onClick={() => setConsumablesRider(!consumablesRider)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${consumablesRider ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                    {consumablesRider ? 'Remove' : 'Add (+₹1,500)'}
                 </button>
              </div>

              {/* RIDER 5: ROOM UPGRADE */}
              <div className={`flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-xl border transition-all ${roomRiderActive ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2 md:justify-start justify-center">
                       Room Upgrade
                       {roomRiderActive && <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">Active</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Upgrade from Single Private Room.</p>
                 </div>
                 <div className="flex items-center gap-2">
                   {roomRiderActive && (
                     <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="text-xs font-bold border rounded-lg p-2">
                       <option value="Single Private AC Room">Single Private AC</option>
                       <option value="Deluxe Room">Deluxe Room</option>
                       <option value="Any Room">Any Room Category</option>
                     </select>
                   )}
                   <button onClick={() => setRoomRiderActive(!roomRiderActive)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${roomRiderActive ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'}`}>
                     {roomRiderActive ? 'Remove' : 'Upgrade'}
                   </button>
                 </div>
              </div>

              {/* RIDER 6: DEDUCTIBLE */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-5 rounded-xl border bg-gray-50 border-gray-100">
                 <div className="flex-1 text-center md:text-left">
                    <p className="text-sm font-bold text-gray-900 uppercase">Voluntary Deductible</p>
                    <p className="text-xs text-gray-500 mt-1">Choose a deductible to lower your premium.</p>
                 </div>
                 <select 
                   value={selectedDeductible} 
                   onChange={(e) => setSelectedDeductible(e.target.value)} 
                   className="text-xs font-bold border border-gray-300 rounded-lg p-2 bg-white"
                 >
                   <option value="None">None</option>
                   <option value="10k">₹10,000 (-₹1,000)</option>
                   <option value="25k">₹25,000 (-₹2,500)</option>
                   <option value="50k">₹50,000 (-₹5,000)</option>
                   <option value="1L">₹1,00,000 (-₹8,000)</option>
                 </select>
              </div>
           </div>
        </section>

        {/* EXCLUSIONS */}
        <section aria-labelledby="exclusions-heading">
           <h2 id="exclusions-heading" className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">❌ Standard Exclusions</h2>
           <div className="flex flex-wrap gap-2">
              {['Global Treatment', 'Cosmetic Surgery', 'Adventure Sports', 'Experimental Care'].map((exc, i) => (
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

export default SeniorPlanReview;