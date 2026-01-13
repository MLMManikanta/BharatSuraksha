import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FamilyPlanReview = ({ data }) => {
  const navigate = useNavigate();
  const basePremium = data?.basePremium || 10500;
  const siValue = data?.sumInsured?.value || 0;
  const siLabel = data?.sumInsured?.label || "₹10L";

  // --- 1. RIDER STATES ---
  const [roomRiderActive, setRoomRiderActive] = useState(false);
  const [selectedRoomLimit, setSelectedRoomLimit] = useState("Single Private Room");
  const [airAmbulanceActive, setAirAmbulanceActive] = useState(false);
  const [maternityWaitingRider, setMaternityWaitingRider] = useState(false);
  const [currentPremium, setCurrentPremium] = useState(basePremium);

  // --- 2. DYNAMIC PRICING LOGIC ---
  useEffect(() => {
    let total = basePremium;
    if (airAmbulanceActive) total += 2500; 
    if (maternityWaitingRider) total += 3500;
    // Price increases for "Any Room" vs decrease for "Restricted Room"
    if (roomRiderActive) total -= 1200; 
    setCurrentPremium(total);
  }, [roomRiderActive, airAmbulanceActive, maternityWaitingRider, basePremium]);

  // --- 3. DYNAMIC MATERNITY LOGIC ---
  const maternityLimit = siValue >= 3000000 ? "₹2,00,000" : "₹1,00,000"; 

  const handleBack = () => {
    navigate('/select-plan', { state: { ...data, activeTab: 'parivar' } });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-6 border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Plan Review</h2>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Parivar Suraksha Details ({siLabel})</p>
        </div>
        <button onClick={handleBack} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-md transition-all">
          ← Previous Step
        </button>
      </div>

      {/* CORE POLICY FACTORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Rent & Category</p>
          <p className="font-bold text-slate-800 text-lg">
            {roomRiderActive ? selectedRoomLimit : "Any Private AC Room"}
          </p>
          <p className="text-xs text-slate-500">
            {roomRiderActive ? "Restricted room category selected for premium discount." : "No capping on room rent. Choose any category of private AC room."}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment & Treatment Coverage</p>
          <p className="font-bold text-green-600 text-lg">0% Co-Pay (Nil)</p>
          <ul className="text-[11px] text-slate-500 space-y-1 italic">
            <li>• Modern Treatments Covered (Full SI)</li>
            <li>• AYUSH (Ayurveda/Homeo) Covered (Full SI)</li>
            <li>• Domiciliary (Home) Treatment Covered (Min. 3 continuous days)</li>
          </ul>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maternity Benefit</p>
          <p className="font-bold text-slate-800 text-lg">{maternityLimit} Limit</p>
          <p className="text-xs text-slate-500 font-bold underline">
            Waiting Period: {maternityWaitingRider ? "1 Year (Rider Applied)" : "3 Years (Standard)"}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extended Benefits</p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>• Pre-Hospitalization: 60 Days</li>
            <li>• Post-Hospitalization: 180 Days</li>
            <li className="text-green-600 font-bold">• Non-Medical Expenses (Consumables) Covered</li>
          </ul>
        </div>
      </div>

      {/* RIDER SECTION */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">✨ Riders (Available Add-ons)</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* 1. Room Restriction Rider */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex-1">
              <p className="text-xs font-black text-slate-800 uppercase">Room Type Restriction</p>
              <p className="text-[10px] text-slate-500">Opt for a specific room type to reduce your premium.</p>
            </div>
            <div className="flex items-center gap-3">
              {roomRiderActive && (
                <select 
                  value={selectedRoomLimit}
                  onChange={(e) => setSelectedRoomLimit(e.target.value)}
                  className="text-xs font-bold border rounded-lg p-2 bg-slate-50"
                >
                  <option value="Single Private Room">Single Private Room</option>
                  <option value="Single Private AC Room">Single Private AC Room</option>
                  <option value="Twin Sharing">Twin Sharing Room</option>
                </select>
              )}
              <button onClick={() => setRoomRiderActive(!roomRiderActive)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${roomRiderActive ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {roomRiderActive ? '✓ DISCOUNT APPLIED' : '+ ACTIVATE RIDER'}
              </button>
            </div>
          </div>

          {/* 2. Maternity Waiting Reduction Rider */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex-1">
              <p className="text-xs font-black text-slate-800 uppercase">Reduction in Maternity Waiting</p>
              <p className="text-[10px] text-slate-500">Reduce the standard 3-year waiting period to 1 year.</p>
            </div>
            <button onClick={() => setMaternityWaitingRider(!maternityWaitingRider)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${maternityWaitingRider ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}>
              {maternityWaitingRider ? '✓ 1 YEAR WAITING ACTIVE' : '+ ADD RIDER (+₹3,500)'}
            </button>
          </div>

          {/* 3. Air Ambulance Rider */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex-1">
              <p className="text-xs font-black text-slate-800 uppercase">Air Ambulance Cover</p>
              <p className="text-[10px] text-slate-500">Emergency Aero-medical evacuation coverage.</p>
            </div>
            <button onClick={() => setAirAmbulanceActive(!airAmbulanceActive)} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${airAmbulanceActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600'}`}>
              {airAmbulanceActive ? '✓ ADDED (+₹2,500)' : '+ ADD RIDER'}
            </button>
          </div>
        </div>
      </div>

      {/* EXCLUSIONS */}
      <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
        <h3 className="text-xs font-black text-red-900 uppercase tracking-widest mb-4">❌ Not Covered</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Global Treatment', 'Cosmetic Surgery', 'Infertility / IVF', 'Adventure Sports'].map((exc, i) => (
            <div key={i} className="text-[10px] font-bold text-red-700 bg-white/60 p-3 rounded-xl border border-red-200 text-center uppercase tracking-tighter">
              {exc}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FamilyPlanReview;