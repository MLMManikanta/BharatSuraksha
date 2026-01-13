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
    if (roomRiderActive) total -= 1200; 
    setCurrentPremium(total);
  }, [roomRiderActive, airAmbulanceActive, maternityWaitingRider, basePremium]);

  // --- 3. DYNAMIC MATERNITY LOGIC ---
  const maternityLimit = siValue >= 3000000 ? "₹2,00,000" : "₹1,00,000"; 

  const handleBack = () => {
    navigate('/select-plan', { state: { ...data, activeTab: 'parivar' } });
  };

  return (
    <main className="p-8 space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER - Semantic <header> with WCAG high-contrast sub-text */}
      <header className="flex justify-between items-center border-b pb-6 border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Plan Review</h1>
          <p className="text-sm font-bold text-blue-800 uppercase tracking-widest mt-1">
            Parivar Suraksha Details ({siLabel})
          </p>
        </div>
        <button 
          onClick={handleBack} 
          aria-label="Return to previous plan selection step"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-md transition-all focus:ring-4 focus:ring-slate-300"
        >
          <span aria-hidden="true">←</span> Previous Step
        </button>
      </header>

      {/* CORE POLICY FACTORS - Darkened labels (slate-600) for WCAG 1.4.3 compliance */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12" aria-labelledby="core-factors-title">
        <h2 id="core-factors-title" className="sr-only">Core Policy Factors</h2>

        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Room Rent & Category</h3>
          <p className="font-extrabold text-slate-900 text-xl">
            {roomRiderActive ? selectedRoomLimit : "Any Private AC Room"}
          </p>
          <p className="text-sm text-slate-600">
            {roomRiderActive ? "Restricted room category selected for premium discount." : "No capping on room rent. Choose any category of private AC room."}
          </p>
        </article>

        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Payment & Treatment Coverage</h3>
          <p className="font-extrabold text-green-800 text-xl">0% Co-Pay (Nil)</p>
          <ul className="text-sm text-slate-700 space-y-1 font-medium" aria-label="Coverage details">
            <li>• Modern Treatments Covered (Full SI)</li>
            <li>• AYUSH (Ayurveda/Homeo) Covered (Full SI)</li>
            <li>• Domiciliary Treatment (Min. 3 continuous days)</li>
          </ul>
        </article>

        {/* WAITING PERIOD STATUS (New Section for Family Page) */}
        <article className="space-y-4">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Waiting Period Status</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="text-lg font-extrabold text-slate-900">30 Days Initial Waiting</p>
              <p className="text-xs text-slate-600">Minimum period policyholder needs to wait before filing a claim (except accidents).</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="text-lg font-extrabold text-slate-900">3 Years Existing Illness (PED)</p>
              <p className="text-xs text-slate-600">Waiting for pre-existing illnesses like diabetes, thyroid, etc.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-3">
              <p className="text-lg font-extrabold text-slate-900">24 Months Specific Illness</p>
              <p className="text-xs text-slate-600">Covers slow growing diseases like hernia, cataract, ENT disorders, and joint replacement.</p>
            </div>
          </div>
        </article>

        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Maternity & Benefits</h3>
          <p className="font-extrabold text-slate-900 text-xl">{maternityLimit} Limit</p>
          <p className="text-sm text-slate-700 font-bold underline decoration-slate-300">
            Maternity Waiting: {maternityWaitingRider ? "1 Year (Rider Applied)" : "3 Years (Standard)"}
          </p>
          <ul className="text-sm text-slate-700 space-y-1 mt-2 font-medium">
            <li>• Pre-Hospitalization: 60 Days</li>
            <li>• Post-Hospitalization: 180 Days</li>
            <li className="text-green-800 font-bold">• Non-Medical Consumables Covered</li>
          </ul>
        </article>
      </section>

      {/* RIDER SECTION */}
      <section className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 space-y-6" aria-labelledby="riders-title">
        <h2 id="riders-title" className="text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          ✨ Riders <span className="text-xs font-medium text-slate-600 normal-case tracking-normal">(Available Add-ons)</span>
        </h2>
        
        <div className="grid grid-cols-1 gap-5">
          {/* 1. Room Restriction Rider */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900 uppercase">Room Type Restriction</p>
              <p className="text-sm text-slate-600">Opt for a restricted room type to receive a premium discount.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              {roomRiderActive && (
                <>
                  <label htmlFor="room-select" className="sr-only">Select Restricted Room Category</label>
                  <select 
                    id="room-select"
                    value={selectedRoomLimit}
                    onChange={(e) => setSelectedRoomLimit(e.target.value)}
                    className="w-full md:w-auto text-sm font-bold border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Single Private Room">Single Private Room</option>
                    <option value="Single Private AC Room">Single Private AC Room</option>
                    <option value="Twin Sharing">Twin Sharing Room</option>
                  </select>
                </>
              )}
              <button 
                onClick={() => setRoomRiderActive(!roomRiderActive)} 
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap focus:ring-4 ${roomRiderActive ? 'bg-amber-600 text-white shadow-inner focus:ring-amber-200' : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 focus:ring-slate-300'}`}
              >
                {roomRiderActive ? '✓ DISCOUNT APPLIED' : '+ ACTIVATE RIDER'}
              </button>
            </div>
          </div>

          {/* 2. Maternity Waiting Reduction Rider */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-bold text-slate-900 uppercase">Reduction in Maternity Waiting</p>
              <p className="text-sm text-slate-600">Reduce standard 3-year waiting period to 1 year.</p>
            </div>
            <button 
              onClick={() => setMaternityWaitingRider(!maternityWaitingRider)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all focus:ring-4 ${maternityWaitingRider ? 'bg-blue-700 text-white shadow-lg focus:ring-blue-200' : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 focus:ring-slate-300'}`}
            >
              {maternityWaitingRider ? '✓ 1 YEAR WAITING ACTIVE' : '+ ADD RIDER (+₹3,500)'}
            </button>
          </div>

          {/* 3. Air Ambulance Rider */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm font-bold text-slate-900 uppercase">Air Ambulance Cover</p>
              <p className="text-sm text-slate-600">Emergency Aero-medical evacuation coverage.</p>
            </div>
            <button 
              onClick={() => setAirAmbulanceActive(!airAmbulanceActive)} 
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all focus:ring-4 ${airAmbulanceActive ? 'bg-blue-700 text-white shadow-lg focus:ring-blue-200' : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 focus:ring-slate-300'}`}
            >
              {airAmbulanceActive ? '✓ ADDED (+₹2,500)' : '+ ADD RIDER'}
            </button>
          </div>
        </div>
      </section>

      {/* EXCLUSIONS */}
      <section className="bg-red-50 rounded-[2rem] p-8 border border-red-200 shadow-sm" aria-labelledby="exclusions-title">
        <h2 id="exclusions-title" className="text-xs font-black text-red-900 uppercase tracking-widest mb-6">❌ Not Covered</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Global Treatment', 'Cosmetic Surgery', 'Infertility / IVF', 'Adventure Sports'].map((exc, i) => (
            <div key={i} className="text-xs font-bold text-red-900 bg-white p-4 rounded-xl border border-red-200 text-center uppercase shadow-sm">
              {exc}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default FamilyPlanReview;