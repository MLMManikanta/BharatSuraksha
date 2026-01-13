import React, { useState, useEffect } from 'react';

const CustomizeHealthPage = ({ initialData, onProceed }) => {
  // --- 1. DATA CONFIGURATION ---
  const sumInsuredSteps = [
    { label: "10L", value: 1000000 },
    { label: "15L", value: 1500000 },
    { label: "20L", value: 2000000 },
    { label: "30L", value: 3000000 },
    { label: "50L", value: 5000000 },
    { label: "1Cr", value: 10000000 },
    { label: "1.5Cr", value: 15000000 },
    { label: "2Cr", value: 20000000 },
    { label: "3Cr", value: 30000000 },
    { label: "5Cr", value: 50000000 },
    { label: "Unlimited", value: 999999999 }
  ];

  const chronicDiseases = ["Diabetes", "High Cholesterol", "COPD", "Heart Disease", "Hypertension", "Asthma"];

  // --- 2. STATE ---
  const [sliderIndex, setSliderIndex] = useState(0);
  const [tenure, setTenure] = useState(1);
  const [preHosp, setPreHosp] = useState(60);
  const [postHosp, setPostHosp] = useState(90);
  const [chronicActive, setChronicActive] = useState(false);
  const [selectedChronic, setSelectedChronic] = useState(['Diabetes']);

  const currentSI = sumInsuredSteps[sliderIndex];
  const isBaseUnlimited = currentSI.value === 999999999;

  // Features List with Locked Items
  const [features, setFeatures] = useState([
    { id: 'global', label: 'Global Coverage', icon: '🌍', active: true },
    { id: 'claim_100', label: '100% Claim Coverage', icon: '💯', active: true, isLocked: true },
    { id: 'maternity_global', label: 'Maternity Cover', icon: '🤰', active: true },
    { id: 'non_deduct', label: 'Non-Deductible Items Covered', icon: '📄', active: true },
    { id: 'health_check', label: 'Free Health Checkup', icon: '🩺', active: true },
    { id: 'secure', label: 'Secure Benefit', icon: '🛡️', active: true },
    { id: 'restore', label: 'Automatic Restore Benefit', icon: '🔄', active: true },
    { id: 'air_amb', label: 'Emergency Air Ambulance', icon: '🚁', active: false },
    { id: 'hosp_mandatory', label: 'Hospitalisation Cover', icon: '🏥', active: true, isLocked: true },
    { id: 'day_care', label: 'Day Care Procedures', icon: '💊', active: true },
    { id: 'ayush', label: 'AYUSH Benefits', icon: '🌿', active: true },
    { id: 'organ', label: 'Organ Donor Expenses', icon: '🤝', active: false },
    { id: 'domiciliary', label: 'Domiciliary Expenses', icon: '🏠', active: true },
    { id: 'no_sublimit', label: 'No Sublimit on Medical Treatment', icon: '🔓', active: true, isLocked: true },
  ]);

  const [riders, setRiders] = useState([
    { id: 'unlimited_care', label: 'Unlimited Care', desc: 'Once in a lifetime benefit cover.', icon: '♾️', active: false },
    { id: 'inflation_shield', label: 'Inflation Shield', desc: 'SI increases annually matching inflation.', icon: '📈', active: false },
    { id: 'tele_consult', label: 'Tele-Consultation', desc: 'Unlimited online doctor consults 24/7', icon: '📱', active: false },
    { id: 'smart_agg', label: 'Smart Aggregate', desc: 'Unlock total tenure cover in 1st Year', icon: '📅', active: false },
    { id: 'super_bonus', label: 'Super Bonus', desc: '7x Coverage irrespective of claims', icon: '🚀', active: false },
    { id: 'ped_wait', label: 'PED Wait Reduction', desc: 'Reduce Pre-existing disease wait to 1 Yr', icon: '📉', active: false },
    { id: 'specific_wait', label: 'Specific Disease Wait', desc: 'Modify waiting period for listed illnesses', icon: '📋', active: false },
    { id: 'maternity_boost', label: 'Maternity Booster', desc: 'Up to ₹3L Worldwide Limit', icon: '🤰', active: false, waitOption: 2 },
  ]);

  const isMaternityActive = features.find(f => f.id === 'maternity_global')?.active;

  // --- 3. LOGIC HANDLERS ---
  const handleProceed = () => {
    // Bundle all state data to pass to the parent component
    const customConfig = {
      currentSI,
      tenure,
      preHosp,
      postHosp,
      features,
      riders,
      selectedChronic: chronicActive ? selectedChronic : []
    };
    
    // Call the parent proceed function
    if (onProceed) {
      onProceed(customConfig);
    }
  };

  useEffect(() => {
    setRiders(prev => prev.map(r => r.id === 'smart_agg' ? { ...r, active: tenure > 1 } : r));
  }, [tenure]);

  const toggleFeature = (id) => setFeatures(prev => prev.map(f => {
    if (f.id === id) {
      if (f.isLocked) return f;
      return { ...f, active: !f.active };
    }
    return f;
  }));

  const toggleRider = (id) => {
    if (id === 'unlimited_care' && isBaseUnlimited) return;
    setRiders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <main className="max-w-7xl mx-auto p-4 space-y-8 bg-gray-50 min-h-screen font-sans">
      <header className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl border-b-4 border-blue-600">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter">Vajra Suraksha Builder</h1>
        <p className="text-blue-100 text-sm font-bold uppercase mt-1">Configure Your Ultimate Health Shield</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. SUM INSURED SLIDER */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-slate-800 uppercase text-sm">Sum Insured</h2>
              <span className="text-3xl font-black text-blue-800">₹{currentSI.label}</span>
            </div>
            <input 
              type="range" min="0" max={sumInsuredSteps.length - 1} step="1" 
              value={sliderIndex} 
              onChange={(e) => setSliderIndex(Number(e.target.value))} 
              className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-800" 
            />
            <div className="flex justify-between mt-2">
               {sumInsuredSteps.map((s, i) => (
                 <span key={i} className={`text-[9px] font-bold ${i === sliderIndex ? 'text-blue-800' : 'text-gray-400'}`}>{s.label}</span>
               ))}
            </div>
          </section>

          {/* 2. PRE/POST DURATION */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-slate-800 uppercase text-sm mb-6">Hospitalisation Duration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <fieldset>
                <legend className="text-[11px] font-bold text-gray-600 uppercase mb-3">Pre-Hospitalisation</legend>
                <div className="flex gap-2">
                  {[30, 60, 90].map(d => (
                    <button key={d} onClick={() => setPreHosp(d)} className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${preHosp === d ? 'border-blue-700 bg-blue-50 text-blue-900' : 'border-gray-100 text-gray-500'}`}>
                      {d} Days
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-[11px] font-bold text-gray-600 uppercase mb-3">Post-Hospitalisation</legend>
                <div className="flex gap-2">
                  {[60, 90, 180].map(d => (
                    <button key={d} onClick={() => setPostHosp(d)} className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${postHosp === d ? 'border-blue-700 bg-blue-50 text-blue-900' : 'border-gray-100 text-gray-500'}`}>
                      {d} Days
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          {/* 3. BASE FEATURES */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-slate-800 uppercase text-sm mb-6">Base Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {features.map(f => (
                <button key={f.id} onClick={() => toggleFeature(f.id)} disabled={f.isLocked}
                  className={`min-h-[110px] p-4 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center relative ${f.active ? 'border-blue-700 bg-blue-50' : 'border-gray-100 bg-white opacity-60'}`}>
                  {f.isLocked && <span className="absolute top-2 right-2 text-xs grayscale">🔒</span>}
                  <span className="text-2xl mb-2">{f.icon}</span>
                  <span className="text-[11px] font-black uppercase leading-tight text-slate-800">{f.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-900 font-bold uppercase text-[10px]">
               Note: Maternity cover starts from 10% of Sum Insured up to ₹2 Lakhs.
            </div>
          </section>

          {/* 4. CHRONIC CARE */}
          <section className="bg-white p-6 rounded-2xl border border-orange-200 shadow-sm">
             <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">💊</span>
                  <div>
                    <h2 className="font-bold text-orange-950 uppercase text-sm">Chronic Care (Day 31+)</h2>
                    <p className="text-[11px] text-orange-900 uppercase font-bold">Conditions covered from 31st day</p>
                  </div>
                </div>
                <button onClick={() => setChronicActive(!chronicActive)} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${chronicActive ? 'bg-orange-800 text-white' : 'bg-orange-100 text-orange-900 border border-orange-200'}`}>
                  {chronicActive ? 'Active' : 'Add Cover'}
                </button>
             </div>
             {chronicActive && (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                    {chronicDiseases.map(d => (
                        <button key={d} onClick={() => setSelectedChronic(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} className={`py-3 text-[10px] font-bold rounded-xl border-2 ${selectedChronic.includes(d) ? 'border-orange-800 bg-orange-800 text-white' : 'border-gray-100 text-slate-600'}`}>
                          {d}
                        </button>
                    ))}
                 </div>
             )}
          </section>

          {/* 5. PREMIUM RIDERS */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-slate-800 uppercase text-sm mb-6">Premium Riders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riders.map(r => {
                if (r.id === 'maternity_boost' && !isMaternityActive) return null;
                const isDisabled = (r.id === 'unlimited_care' && isBaseUnlimited) || (r.id === 'smart_agg' && tenure === 1);
                return (
                  <button key={r.id} disabled={isDisabled} onClick={() => toggleRider(r.id)} 
                    className={`flex items-start p-5 rounded-2xl border-2 text-left transition-all ${isDisabled ? 'opacity-30 grayscale cursor-not-allowed' : r.active ? 'border-teal-800 bg-teal-50' : 'border-gray-100 bg-white'}`}>
                    <span className="text-4xl mr-4">{r.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-[13px] uppercase text-slate-950 leading-tight">{r.label}</h3>
                      <p className="text-[11px] text-slate-700 mt-1 font-medium">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* 6. EXPANDED SUMMARY SIDEBAR */}
        <aside className="lg:col-span-4 h-fit sticky top-6">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 space-y-8">
            <h2 className="font-black text-slate-900 uppercase text-2xl border-b pb-6 tracking-tighter">Plan Summary</h2>

            <div className="space-y-8">
              <fieldset className="flex flex-col gap-4">
                <legend className="text-xs font-bold text-gray-600 uppercase block mb-2">Policy Tenure</legend>
                <div className="grid grid-cols-3 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                  {[1, 2, 3].map((y) => (
                    <button key={y} onClick={() => setTenure(y)} className={`py-3 text-sm font-bold rounded-lg transition-all ${tenure === y ? 'bg-white text-blue-800 shadow-md' : 'text-gray-500'}`}>
                      {y} Year{y > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm font-bold uppercase">
                  <span className="text-gray-500">Sum Insured</span>
                  <span className="text-blue-800">₹{currentSI.label}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold uppercase">
                  <span className="text-gray-500">Pre/Post Hosp</span>
                  <span className="text-blue-800">{preHosp}/{postHosp} Days</span>
                </div>
              </div>

              {chronicActive && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-orange-700 uppercase">Chronic Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedChronic.map(cond => (
                      <span key={cond} className="text-[10px] font-bold bg-orange-50 text-orange-800 px-3 py-1 rounded-full border border-orange-100">
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase">Active Base Features</h3>
                <div className="max-h-60 overflow-y-auto pr-3 space-y-2">
                  {features.filter(f => f.active).map(f => (
                    <div key={f.id} className="flex items-center gap-3 text-[12px] text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span>{f.icon}</span>
                      <span className="font-bold">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase">Selected Riders</h3>
                <div className="max-h-40 overflow-y-auto pr-3 space-y-2">
                  {riders.filter(r => r.active).length > 0 ? (
                    riders.filter(r => r.active).map(r => (
                      <div key={r.id} className="flex items-center gap-3 text-[12px] text-teal-900 bg-teal-50 p-3 rounded-xl border border-teal-100">
                        <span>{r.icon}</span>
                        <span className="font-bold">{r.label}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No riders selected</span>
                  )}
                </div>
              </div>
            </div>

            <button onClick={handleProceed} 
              className="w-full py-5 bg-blue-800 text-white font-black rounded-xl uppercase tracking-widest italic shadow-xl hover:bg-blue-900 transition-all active:scale-95 min-h-[56px]">
              Confirm Selection &rarr;
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CustomizeHealthPage;