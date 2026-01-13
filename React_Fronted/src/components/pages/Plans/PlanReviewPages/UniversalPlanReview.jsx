import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UniversalPlanReview = ({ data }) => {
  const navigate = useNavigate();
  
  // --- 1. DATA & LOGIC INITIALIZATION ---
  const basePremium = data?.basePremium || 45000;
  const siValue = data?.sumInsured?.value || 0;
  const siLabel = data?.sumInsured?.label || "";

  /** * FIXED LOGIC: We check if the label includes "Unlimited" or the value is 99Cr.
   * This ensures the Secure Benefit disappears correctly for all "Unlimited" variants.
   */
  const isUnlimited = 
    siLabel.toLowerCase().includes('unlimited') || 
    Number(siValue) >= 990000000;

  // --- 2. RIDER & PRICING STATES ---
  const [opdRider, setOpdRider] = useState(false);
  const [globalMaternity, setGlobalMaternity] = useState(false);
  const [currentPremium, setCurrentPremium] = useState(basePremium);

  // --- 3. DYNAMIC PRICING LOGIC ---
  useEffect(() => {
    let total = basePremium;
    if (opdRider) total += 12000;
    if (globalMaternity) total += 15000;
    setCurrentPremium(total);
  }, [opdRider, globalMaternity, basePremium]);

  const handleBack = () => {
    navigate('/select-plan', { 
      state: { ...data, activeTab: 'vishwa' } 
    });
  };

  return (
    <main className="p-8 space-y-10 animate-in fade-in duration-500 pb-20 bg-gradient-to-b from-white to-emerald-50/30">
      
      {/* ELITE HEADER */}
      <header className="flex justify-between items-center border-b-2 pb-6 border-emerald-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
              PREMIUM ELITE
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
            VISHWA SURAKSHA
          </h1>
          <p className="text-sm font-bold text-emerald-800 uppercase tracking-widest mt-1">
            WORLDWIDE PROTECTION REVIEW ({siLabel})
          </p>
        </div>
        <button 
          onClick={handleBack} 
          className="flex items-center gap-2 px-6 py-3 text-sm font-black text-white bg-emerald-800 hover:bg-emerald-900 rounded-2xl shadow-xl transition-all focus:ring-4 focus:ring-emerald-200"
        >
          ← Back to Plans
        </button>
      </header>

      {/* CORE POLICY FACTORS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12" aria-label="Policy Details">
        
        {/* GLOBAL COVERAGE HIGHLIGHT */}
        <article className="md:col-span-2 bg-emerald-900 text-white p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-emerald-100">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-80">PRIMARY BENEFIT</h3>
            <p className="text-2xl font-black leading-tight italic">Worldwide Cashless Hospitalization</p>
            <p className="text-sm font-medium opacity-90">
              Covers treatment anywhere in the world including USA & Canada.
            </p>
          </div>
          <div className="text-5xl" aria-hidden="true">🌍</div>
        </article>

        {/* ROOM & COPAY */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ACCOMMODATION & CO-PAY</h3>
          <p className="font-extrabold text-slate-900 text-xl leading-tight">Any Private Room (No Limit)</p>
          <p className="text-lg font-black text-emerald-700 uppercase">0% CO-PAY WORLDWIDE</p>
        </article>

        {/* WAITING PERIOD STATUS - Updated with exact requested text */}
        <article className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">WAITING PERIOD STATUS</h3>
          <div className="space-y-3">
            <div>
                <p className="text-base font-extrabold text-slate-900">30 Days Initial Waiting</p>
                <p className="text-[11px] text-slate-600 leading-tight">Initial Waiting Period for all claims except accidents.</p>
            </div>
            <div className="pt-2 border-t border-emerald-50">
                <p className="text-base font-extrabold text-slate-900">3 Years Existing Illness (PED)</p>
                <p className="text-[11px] text-slate-600 leading-tight">Minimum period to wait before filing a claim for pre-existing illnesses like diabetes, thyroid etc.</p>
            </div>
            <div className="pt-2 border-t border-emerald-50">
                <p className="text-base font-extrabold text-slate-900">24 Months Specific Illness</p>
                <p className="text-[11px] text-slate-600 leading-tight">Specific waiting for slow growing diseases like knee replacement, hernia, cataract, ENT disorders, and osteoporosis.</p>
            </div>
          </div>
        </article>

        {/* MATERNITY */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">UNIVERSAL MATERNITY</h3>
          <p className="font-extrabold text-slate-900 text-xl">₹2,00,000 Limit</p>
          <p className="text-sm text-slate-700 font-bold underline decoration-emerald-200">
            Waiting Period: {globalMaternity ? "1 Year (Rider Applied)" : "2 Years (Standard)"}
          </p>
        </article>

        {/* CONDITIONAL RESTORATION (SECURE BENEFIT) - Only shows if NOT Unlimited */}
        {!isUnlimited && (
          <article className="space-y-2 animate-in slide-in-from-left duration-500">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">SECURE BENEFIT</h3>
            <p className="font-extrabold text-slate-900 text-xl leading-tight">Unlimited Automatic Restoration</p>
            <p className="text-sm text-slate-600 italic">
              Refills instantly upon exhaustion starting from the 2nd claim for unrelated illnesses.
            </p>
          </article>
        )}

        {/* RENEWAL BONUS FEATURE */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">RENEWAL BENEFITS</h3>
          <div className="bg-emerald-100/50 p-4 rounded-2xl border border-emerald-200">
            <p className="text-lg font-black text-emerald-800 italic leading-tight">5x Renewal Bonus Added</p>
            <p className="text-sm text-emerald-700 font-medium mt-1">
              Extra Sum Insured added upon renewal, growing up to 500% of base coverage.
            </p>
          </div>
        </article>

        {/* RECOVERY & LOGISTICS */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">RECOVERY & LOGISTICS</h3>
          <ul className="text-sm text-slate-700 space-y-2 font-semibold">
            <li className="flex items-center gap-2 text-emerald-700">🚁 International Air Ambulance Included</li>
            <li>• Non-Medical Consumables (100% Covered)</li>
            <li>• Pre-Hosp: 90 Days | Post-Hosp: 180 Days</li>
          </ul>
        </article>
      </section>

      {/* RIDER SECTION */}
      <section className="bg-white border-2 border-emerald-100 rounded-[2.5rem] p-8 space-y-6 shadow-xl" aria-labelledby="riders-heading">
        <h2 id="riders-heading" className="text-base font-black text-emerald-900 uppercase tracking-widest flex items-center gap-2">
          💎 Elite Customizations <span className="text-xs font-medium text-slate-600 normal-case">(Vishwa Exclusive)</span>
        </h2>
        
        <div className="grid grid-cols-1 gap-5">
          <div className="flex flex-col md:flex-row justify-between items-center bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-900 uppercase">Maternity Waiting Reduction</p>
              <p className="text-xs text-emerald-700 font-medium">Reduce waiting period to 1 year for elite care.</p>
            </div>
            <button 
              onClick={() => setGlobalMaternity(!globalMaternity)} 
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all ${globalMaternity ? 'bg-emerald-700 text-white shadow-lg' : 'bg-white text-emerald-700 border border-emerald-200'}`}
            >
              {globalMaternity ? '✓ RIDER ACTIVE' : '+ REDUCE WAITING'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-900 uppercase">Worldwide OPD & Mental Wellness</p>
              <p className="text-xs text-emerald-700 font-medium">Global doctor visits and prescriptions up to ₹50k.</p>
            </div>
            <button 
              onClick={() => setOpdRider(!opdRider)} 
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black transition-all ${opdRider ? 'bg-emerald-700 text-white shadow-lg' : 'bg-white text-emerald-700 border border-emerald-200'}`}
            >
              {opdRider ? '✓ OPD ACTIVE' : '+ ADD OPD COVER'}
            </button>
          </div>
        </div>
      </section>

      {/* GLOBAL EXCLUSIONS */}
      <section className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-700 text-white shadow-2xl">
        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
          <span>❌</span> Universal Exclusions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-[10px] font-bold">
          {['Cosmetic Surgery', 'Self-Inflicted Injuries', 'War & Nuclear Perils', 'Unproven Treatments'].map((exc, i) => (
            <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center uppercase tracking-widest opacity-80">
              {exc}
            </div>
          ))}
        </div>
      </section>
      
    </main>
  );
};

export default UniversalPlanReview;