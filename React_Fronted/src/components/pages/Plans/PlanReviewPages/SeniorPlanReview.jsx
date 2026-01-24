import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Varishtha Suraksha Rider Pricing (from CSV specification)
const VARISHTHA_RIDER_COSTS = {
  chronicCare: 4032,           // Per condition
  pedReduction: 3387,          // 3 years to 1 year
  specificIllnessReduction: 5302, // 2 years to 1 year
  copayWaiver: { '5%': 1234, '0%': 1934 },
  consumables: 996,
  roomRent: {
    'Any Room': 1267,
    'Deluxe Room': 967,
    'Single Private AC Room': 489
  },
  deductible: {
    '10k': 1568,
    '25k': 3067,
    '50k': 4998,
    '1L': 8654
  }
};

const CHRONIC_CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'high_cholesterol', label: 'High Cholesterol' },
  { id: 'copd', label: 'COPD' },
  { id: 'heart_disease', label: 'Heart Disease' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'asthma', label: 'Asthma' }
];

const SeniorPlanReview = ({ data, onChange }) => {
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
  const [selectedChronicConditions, setSelectedChronicConditions] = useState([]);

  // Toggle chronic condition
  const toggleChronicCondition = useCallback((conditionId) => {
    setSelectedChronicConditions(prev => 
      prev.includes(conditionId) 
        ? prev.filter(c => c !== conditionId)
        : [...prev, conditionId]
    );
  }, []);

  // Calculate premium using useMemo (no setState in render)
  const currentPremium = useMemo(() => {
    let total = basePremium;
    
    // Chronic Care Conditions (from Day 31) - ₹4,032 per condition
    total += selectedChronicConditions.length * VARISHTHA_RIDER_COSTS.chronicCare;
    
    // PED Waiting Period Reduction (3yr to 1yr) - ₹3,387
    if (pedCoverActive) total += VARISHTHA_RIDER_COSTS.pedReduction;
    
    // Specific Illness Waiting Period Reduction (2yr to 1yr) - ₹5,302
    if (specificIllnessRider) total += VARISHTHA_RIDER_COSTS.specificIllnessReduction;
    
    // Non-Medical Consumables - ₹996
    if (consumablesRider) total += VARISHTHA_RIDER_COSTS.consumables;
    
    // Co-pay Waiver
    if (copayLevel === "5%") total += VARISHTHA_RIDER_COSTS.copayWaiver['5%'];
    if (copayLevel === "0%") total += VARISHTHA_RIDER_COSTS.copayWaiver['0%'];
    
    // Room Rent Upgrade
    if (roomRiderActive && selectedRoom) {
      total += VARISHTHA_RIDER_COSTS.roomRent[selectedRoom] || 0;
    }
    
    // Voluntary Deductible Discount
    if (selectedDeductible !== "None") {
      total -= VARISHTHA_RIDER_COSTS.deductible[selectedDeductible] || 0;
    }

    return total;
  }, [basePremium, pedCoverActive, specificIllnessRider, consumablesRider, copayLevel, roomRiderActive, selectedRoom, selectedDeductible, selectedChronicConditions]);

  // Notify parent component of rider changes
  // Notify parent component of rider changes
  useEffect(() => {
    if (onChange) {
      onChange({
        riderCost: currentPremium - basePremium,
        riders: {
          chronicConditions: selectedChronicConditions,
          pedCover: pedCoverActive,
          specificIllness: specificIllnessRider,
          consumables: consumablesRider,
          copayLevel,
          roomUpgrade: roomRiderActive ? selectedRoom : null,
          deductible: selectedDeductible
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPremium, basePremium, pedCoverActive, specificIllnessRider, consumablesRider, copayLevel, roomRiderActive, selectedRoom, selectedDeductible, selectedChronicConditions]);

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
<section aria-labelledby="riders-title" className="space-y-8 max-w-5xl mx-auto font-sans">
  <div className="flex items-center gap-4">
    <h2 id="riders-title" className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
      Available Riders
    </h2>
    <div className="h-px w-full bg-gray-200" aria-hidden="true"></div>
  </div>

  <div className="grid grid-cols-1 gap-6">
    
    {/* 1. CHRONIC CARE CONDITIONS */}
    <div className={`p-7 rounded-[2.5rem] border-2 transition-all duration-300 ${selectedChronicConditions.length > 0 ? 'bg-orange-50/30 border-[#ff7500]/30 shadow-sm' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Chronic Care Conditions</h3>
            {selectedChronicConditions.length > 0 && (
              <span className="text-[10px] bg-[#ff7500] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider" role="status">
                {selectedChronicConditions.length} Active
              </span>
            )}
          </div>
          <p className="text-xs text-gray-700 mt-1.5 font-medium leading-relaxed max-w-md">
            Enable to cover pre-existing conditions like Diabetes or Hypertension from Day 31.
          </p>
        </div>
        <button 
          aria-pressed={selectedChronicConditions.length > 0}
          onClick={() => selectedChronicConditions.length > 0 ? setSelectedChronicConditions([]) : setSelectedChronicConditions([CHRONIC_CONDITIONS[0].id])}
          className={`min-h-[44px] px-6 py-2.5 rounded-full text-[11px] font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
            selectedChronicConditions.length > 0 ? 'bg-red-50 text-red-700 border-2 border-red-100 hover:bg-red-100' : 'bg-[#ff7500] text-white shadow-lg shadow-orange-100 hover:brightness-110 active:scale-95'
          }`}
        >
          {selectedChronicConditions.length > 0 ? 'REMOVE RIDER' : 'ENABLE RIDER'}
        </button>
      </div>

      {selectedChronicConditions.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div role="group" aria-label="Chronic condition selection" className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {CHRONIC_CONDITIONS.map(condition => {
              const isSelected = selectedChronicConditions.includes(condition.id);
              return (
                <button
                  key={condition.id}
                  aria-pressed={isSelected}
                  onClick={() => toggleChronicCondition(condition.id)}
                  className={`min-h-[56px] px-4 py-3 rounded-2xl text-[11px] font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 ${
                    isSelected ? 'bg-[#ff7500] text-white shadow-md border-[#ff7500]' : 'bg-white text-gray-800 border-2 border-gray-100 hover:border-[#ff7500]/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-left leading-tight">{condition.label}</span>
                    {isSelected && <span className="text-[14px] ml-2" aria-hidden="true">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>

    {/* 2. WAITING PERIOD REDUCTIONS */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { active: pedCoverActive, setter: setPedCoverActive, title: 'PED Reduction', desc: '3 Years → 1 Year', cost: VARISHTHA_RIDER_COSTS.pedReduction },
        { active: specificIllnessRider, setter: setSpecificIllnessRider, title: 'Specific Illness', desc: '2 Years → 1 Year', cost: VARISHTHA_RIDER_COSTS.specificIllnessReduction }
      ].map((rider, idx) => (
        <button 
          key={idx}
          aria-pressed={rider.active}
          onClick={() => rider.setter(!rider.active)}
          className={`group flex justify-between items-center p-6 rounded-[2.5rem] border-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
            rider.active ? 'bg-[#ff7500] border-[#e66a00] shadow-lg text-white' : 'bg-white border-gray-100 text-gray-900 hover:border-[#ff7500]/40'
          }`}
        >
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-wider opacity-90">{rider.title}</p>
            <p className={`text-xs font-bold mt-1 ${rider.active ? 'text-orange-100' : 'text-gray-600'}`}>{rider.desc}</p>
          </div>
          <div className={`text-xs font-black px-4 py-2.5 rounded-xl transition-colors ${rider.active ? 'bg-white/20 text-white' : 'bg-orange-50 text-[#ff7500]'}`}>
            {rider.active ? 'REMOVE' : `+₹${rider.cost.toLocaleString('en-IN')}`}
          </div>
        </button>
      ))}
    </div>

    {/* 3. CO-PAY WAIVER (Synced Pattern) */}
    <div className={`p-7 rounded-[2.5rem] border-2 transition-all duration-300 ${copayLevel !== 'standard' ? 'bg-orange-50/30 border-[#ff7500]/30 shadow-sm' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Co-pay Waiver</h3>
            {copayLevel !== 'standard' && (
              <span className="text-[10px] bg-[#ff7500] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
            )}
          </div>
          <p className="text-xs text-gray-700 mt-1.5 font-medium leading-relaxed max-w-md">
            Standard policy has a 10% co-pay. Enable this to reduce your share to 5% or 0%.
          </p>
        </div>
        <button 
          aria-pressed={copayLevel !== 'standard'}
          onClick={() => copayLevel !== 'standard' ? setCopayLevel('standard') : setCopayLevel('5%')}
          className={`min-h-[44px] px-6 py-2.5 rounded-full text-[11px] font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
            copayLevel !== 'standard' ? 'bg-red-50 text-red-700 border-2 border-red-100 hover:bg-red-100' : 'bg-[#ff7500] text-white shadow-lg'
          }`}
        >
          {copayLevel !== 'standard' ? 'REMOVE RIDER' : 'ENABLE RIDER'}
        </button>
      </div>

      {copayLevel !== 'standard' && (
        <div role="radiogroup" aria-label="Co-pay level" className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
          {[
            { id: '5%', label: '5% Reduced Co-pay', cost: VARISHTHA_RIDER_COSTS.copayWaiver['5%'] },
            { id: '0%', label: '0% Nil Co-pay', cost: VARISHTHA_RIDER_COSTS.copayWaiver['0%'] }
          ].map((opt) => (
            <button
              key={opt.id}
              role="radio"
              aria-checked={copayLevel === opt.id}
              onClick={() => setCopayLevel(opt.id)}
              className={`flex flex-col items-center justify-center min-h-[64px] p-4 rounded-2xl border-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 ${
                copayLevel === opt.id ? 'border-[#ff7500] bg-white shadow-md ring-1 ring-[#ff7500]' : 'border-transparent bg-white/60 text-gray-700 hover:border-orange-200'
              }`}
            >
              <span className={`text-xs font-black ${copayLevel === opt.id ? 'text-[#ff7500]' : ''}`}>{opt.label}</span>
              <span className="text-[10px] font-bold text-orange-600 mt-1.5">+₹{opt.cost.toLocaleString('en-IN')}</span>
            </button>
          ))}
        </div>
      )}
    </div>

    {/* 4. ROOM CATEGORY UPGRADE */}
    <div className={`p-7 rounded-[2.5rem] border-2 transition-all duration-300 ${roomRiderActive ? 'bg-orange-50/30 border-[#ff7500]/30 shadow-inner' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Room Category Upgrade</h3>
          <p className="text-xs text-gray-700 mt-1.5 font-medium leading-relaxed">Upgrade your eligibility to higher room classes.</p>
        </div>
        <button 
          aria-pressed={roomRiderActive}
          onClick={() => setRoomRiderActive(!roomRiderActive)}
          className={`min-h-[44px] px-6 py-2.5 rounded-full text-[11px] font-black transition-all outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
            roomRiderActive ? 'bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100' : 'bg-[#ff7500] text-white shadow-lg'
          }`}
        >
          {roomRiderActive ? 'REMOVE UPGRADE' : 'ENABLE UPGRADE'}
        </button>
      </div>

      {roomRiderActive && (
        <div role="radiogroup" aria-label="Select room type" className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2">
          {Object.entries(VARISHTHA_RIDER_COSTS.roomRent).map(([room, cost]) => (
            <button
              key={room}
              role="radio"
              aria-checked={selectedRoom === room}
              onClick={() => setSelectedRoom(room)}
              className={`flex flex-col p-5 rounded-2xl border-2 transition-all text-center min-h-[80px] justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 ${
                selectedRoom === room ? 'border-[#ff7500] bg-white ring-1 ring-[#ff7500]' : 'border-transparent bg-white/60 text-gray-700 hover:border-orange-200'
              }`}
            >
              <span className="text-[11px] font-black leading-tight">{room}</span>
              <span className="text-[10px] font-black text-[#ff7500] mt-2 tracking-tighter uppercase">+₹{cost.toLocaleString('en-IN')}</span>
            </button>
          ))}
        </div>
      )}
    </div>

    {/* 5. VOLUNTARY DEDUCTIBLE */}
    <div className="p-8 rounded-[2.5rem] border-2 bg-gray-900 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7500]/10 blur-[60px] rounded-full"></div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#ff7500]">Voluntary Deductible</h3>
          <p className="text-[11px] text-gray-300 mt-1.5 font-medium">Paying the first share yourself lowers your annual premium significantly.</p>
        </div>
        <div className="bg-green-500/10 text-green-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-green-500/40 uppercase tracking-wider">Save Up to 35%</div>
      </div>
      <div role="radiogroup" aria-label="Deductible options" className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
        {[
          { id: 'None', label: '0', disc: 0 },
          { id: '10k', label: '10k', disc: VARISHTHA_RIDER_COSTS.deductible['10k'] },
          { id: '25k', label: '25k', disc: VARISHTHA_RIDER_COSTS.deductible['25k'] },
          { id: '50k', label: '50k', disc: VARISHTHA_RIDER_COSTS.deductible['50k'] },
          { id: '1L', label: '1L', disc: VARISHTHA_RIDER_COSTS.deductible['1L'] }
        ].map((opt) => (
          <button
            key={opt.id}
            role="radio"
            aria-checked={selectedDeductible === opt.id}
            onClick={() => setSelectedDeductible(opt.id)}
            className={`min-h-[70px] py-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#ff7500] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${
              selectedDeductible === opt.id ? 'border-[#ff7500] bg-[#ff7500] text-white shadow-lg scale-105' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <span className="text-xs font-black">{opt.label}</span>
            {opt.disc > 0 && <span className={`text-[10px] font-bold ${selectedDeductible === opt.id ? 'text-orange-100' : 'text-green-400'}`}>-₹{opt.disc.toLocaleString('en-IN')}</span>}
          </button>
        ))}
      </div>
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