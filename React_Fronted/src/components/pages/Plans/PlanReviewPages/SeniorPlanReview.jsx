import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SeniorPlanReview = ({ data }) => {
  const navigate = useNavigate();
  const basePremium = data?.basePremium || 18500;
  const siLabel = data?.sumInsured?.label || "₹5L";

  // --- 1. RIDER & POLICY STATES ---
  const [pedCoverActive, setPedCoverActive] = useState(false);
  const [specificIllnessRider, setSpecificIllnessRider] = useState(false);
  const [consumablesRider, setConsumablesRider] = useState(false);
  const [roomRiderActive, setRoomRiderActive] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("Single Private AC Room");
  const [selectedDeductible, setSelectedDeductible] = useState("None");
  // Options: "standard" (10%), "5%", "0%"
  const [copayLevel, setCopayLevel] = useState("standard"); 

  const [currentPremium, setCurrentPremium] = useState(basePremium);

  // --- 2. DYNAMIC PRICING LOGIC ---
  useEffect(() => {
    let total = basePremium;
    
    // Additions (Riders that increase protection)
    if (pedCoverActive) total += 4500;
    if (specificIllnessRider) total += 2200;
    if (consumablesRider) total += 1500;
    if (copayLevel === "5%") total += 2500;
    if (copayLevel === "0%") total += 5500;
    if (roomRiderActive && (selectedRoom === "Deluxe Room" || selectedRoom === "Any Room")) total += 3000;
    
    // Deductions (Riders that reduce premium)
    const deductibleValues = { "10k": 1000, "15k": 1500, "25k": 2500, "40k": 4000, "50k": 5000, "1L": 8000 };
    if (selectedDeductible !== "None") total -= (deductibleValues[selectedDeductible] || 0);

    setCurrentPremium(total);
  }, [pedCoverActive, specificIllnessRider, consumablesRider, copayLevel, roomRiderActive, selectedRoom, selectedDeductible, basePremium]);

  const handleBack = () => {
    navigate('/select-plan', { state: { ...data, activeTab: 'varishtha' } });
  };

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-6 border-slate-200">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight italic">Plan Review</h2>
          <p className="text-sm font-bold text-amber-700 uppercase tracking-widest mt-1">Varishtha Suraksha Details ({siLabel})</p>
        </div>
        <button onClick={handleBack} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-md transition-all">
          ← Previous Step
        </button>
      </div>

      {/* CORE POLICY FACTORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
        
        {/* ROOM RENT */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Room Rent & Category</h3>
          <p className="font-extrabold text-slate-900 text-xl leading-tight">
            {roomRiderActive ? selectedRoom : "Up to Single Private Room"}
          </p>
          <p className="text-sm text-slate-500 italic">Standard coverage includes single private rooms.</p>
        </article>

        {/* CO-PAY */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Co-Payment Details</h3>
          <p className="font-extrabold text-amber-800 text-xl leading-tight">
            {copayLevel === "standard" ? "10% Standard" : copayLevel === "5%" ? "Reduced @ 5%" : "0% (Nil) Co-Pay"}
          </p>
          <p className="text-sm text-slate-500 italic">Shared claim responsibility helps lower your annual premium.</p>
        </article>

        {/* SENIOR BENEFITS */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Premium Senior Care</h3>
          <ul className="text-sm text-slate-700 space-y-2 font-semibold">
            <li className="text-blue-700 flex items-center gap-2">🔹 FREE: Tele-OPD Consultations (24/7)</li>
            <li>• Domiciliary Hospitalization Covered</li>
            <li>• Organ Donor Expenses Included</li>
            <li>• AYUSH Treatment Covered</li>
            <li className={`transition-colors duration-300 ${consumablesRider ? "text-green-700 font-bold" : "text-slate-400"}`}>
               {consumablesRider ? "✓ Non-Medical Consumables Covered" : "• Non-Medical Consumables (Optional)"}
            </li>
          </ul>
        </article>

        {/* WAITING PERIODS */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Waiting Period Status</h3>
          <p className="text-lg font-extrabold text-slate-900">
            PED Cover: <span className="text-amber-700">{pedCoverActive ? "From Day 31" : "Standard 3 Years"}</span>
          </p>
          <p className="text-sm text-slate-600">Specific Illness Waiting: {specificIllnessRider ? "1 Year" : "2 Years"}.</p>
        </article>
      </div>

      {/* RIDER SECTION - ALL 5 RIDERS INCLUDED */}
      <section className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-8 space-y-6">
        <h2 className="text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          ✨ Senior Care Riders (Available Add-ons)
        </h2>
        
        <div className="flex flex-col gap-4">
          
          {/* RIDER 1: PED COVER */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 shadow-sm gap-4">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-bold text-slate-900 uppercase">Pre-existing Disease Cover (Day 31)</p>
              <p className="text-xs text-slate-500">Immediate cover for Diabetes, Hypertension, and Cardiac issues.</p>
            </div>
            <button onClick={() => setPedCoverActive(!pedCoverActive)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${pedCoverActive ? 'bg-amber-700 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {pedCoverActive ? '✓ PED COVER ACTIVE' : '+ ADD RIDER'}
            </button>
          </div>

          {/* RIDER 2: CONSUMABLES */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 shadow-sm gap-4">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-bold text-slate-900 uppercase">Non-Medical Consumables Cover</p>
              <p className="text-xs text-slate-500">Covers 60+ items like gloves, masks, and nebulizer kits.</p>
            </div>
            <button onClick={() => setConsumablesRider(!consumablesRider)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${consumablesRider ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {consumablesRider ? '✓ CONSUMABLES ACTIVE' : '+ ADD RIDER'}
            </button>
          </div>

          {/* RIDER 3: CO-PAY REDUCTION */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 shadow-sm gap-4">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-bold text-slate-900 uppercase">Co-pay Reduction Rider</p>
              <p className="text-xs text-slate-500">Choose to pay less out-of-pocket during a claim.</p>
            </div>
            <select 
              value={copayLevel} 
              onChange={(e) => setCopayLevel(e.target.value)}
              className="w-full md:w-48 text-[11px] font-bold border-2 border-amber-100 rounded-lg p-2.5 bg-amber-50 focus:ring-2 focus:ring-amber-500"
            >
              <option value="standard">Standard (10%)</option>
              <option value="5%">Reduce to 5%</option>
              <option value="0%">Reduce to 0% (Nil)</option>
            </select>
          </div>

          {/* RIDER 4: ROOM UPGRADE */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 shadow-sm gap-4">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-bold text-slate-900 uppercase">Room Upgrade Rider</p>
              <p className="text-xs text-slate-500">Choose a higher category room for your comfort.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {roomRiderActive && (
                <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full text-[10px] font-bold border rounded-lg p-2.5">
                  <option value="Single Private AC Room">Single Private AC</option>
                  <option value="Deluxe Room">Deluxe Room</option>
                  <option value="Any Room">Any Room Category</option>
                </select>
              )}
              <button onClick={() => setRoomRiderActive(!roomRiderActive)} className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${roomRiderActive ? 'bg-amber-700 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {roomRiderActive ? '✓ UPGRADE ACTIVE' : '+ UPGRADE'}
              </button>
            </div>
          </div>

          {/* RIDER 5: DEDUCTIBLE OPTIONS */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-amber-200 shadow-sm gap-4">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-bold text-slate-900 uppercase">Deductible Benefit Options</p>
              <p className="text-xs text-slate-500">Self-pay a small amount to significantly lower your premium.</p>
            </div>
            <select 
              value={selectedDeductible} 
              onChange={(e) => setSelectedDeductible(e.target.value)} 
              className="w-full md:w-48 text-[11px] font-bold border-2 border-amber-100 rounded-lg p-2.5 bg-amber-50"
            >
              <option value="None">No Deductible</option>
              <option value="10k">₹10,000</option>
              <option value="15k">₹15,000</option>
              <option value="25k">₹25,000</option>
              <option value="40k">₹40,000</option>
              <option value="50k">₹50,000</option>
              <option value="1L">₹1,00,000</option>
            </select>
          </div>
        </div>
      </section>

      {/* EXCLUSIONS SECTION */}
      <section className="bg-red-50 rounded-[2.5rem] p-8 border border-red-200 shadow-sm">
        <h3 className="text-xs font-black text-red-900 uppercase tracking-widest mb-6">❌ Standard Policy Exclusions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {['Global Treatment', 'Cosmetic Surgery', 'Adventure Sports', 'Experimental Care'].map((exc, i) => (
            <div key={i} className="text-[10px] font-bold text-red-700 bg-white/60 p-4 rounded-xl border border-red-200 text-center uppercase">
              {exc}
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default SeniorPlanReview;