import React from 'react';

const CustomizeReviewHealthPage = ({ selectionData, onConfirm, onEdit }) => {
  
  // --- 1. SAFETY CHECK: Missing Data ---
  // If no data is passed, show the "No Data" error (Same style as PlanReviewPage)
  if (!selectionData || !selectionData.features) {
    return (
      <div className="p-20 text-center bg-white rounded-[3rem] shadow-xl border border-red-50">
        <div className="text-5xl mb-4">⚠️</div>
        <p className="text-red-400 font-bold uppercase tracking-widest italic text-lg">
          No plan data found.
        </p>
        <p className="text-xs text-slate-400 mt-2 font-bold uppercase">
          Please return to the builder and confirm your selection.
        </p>
        <button 
          onClick={onEdit}
          className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold uppercase rounded-full transition-all"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // --- 2. DESTRUCTURE DATA (With Defaults) ---
  const {
    currentSI,
    tenure,
    preHosp,
    postHosp,
    features = [],
    riders = [],
    selectedChronic = [],
  } = selectionData;

  // Filter for active items only
  const activeFeatures = features.filter((f) => f.active);
  const activeRiders = riders.filter((r) => r.active);

  return (
    <main className="p-8 space-y-10 animate-in fade-in duration-500 pb-20 bg-gradient-to-b from-white to-slate-50/50" role="main">
      
      {/* HEADER */}
      <header className="flex justify-between items-center border-b-2 pb-6 border-blue-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">
              Custom Elite
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
            VAJRA SURAKSHA
          </h1>
          <p className="text-sm font-bold text-blue-800 uppercase tracking-widest mt-1">
            Custom Shield Review ({currentSI?.label || 'N/A'})
          </p>
        </div>
        
        {/* MODIFY BUTTON */}
        <button 
          onClick={onEdit} 
          className="flex items-center gap-2 px-6 py-3 text-sm font-black text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all border border-blue-200 focus:ring-4 focus:ring-blue-100"
        >
          ✎ Modify Plan
        </button>
      </header>

      {/* CORE PROTECTION HIGHLIGHTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
        {/* SUM INSURED CARD */}
        <article className="md:col-span-2 bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-blue-500/20">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-80 text-blue-400">Primary Coverage</h3>
            <p className="text-3xl font-black leading-tight italic">Ultimate Health Capital</p>
            <p className="text-sm font-medium opacity-90">Tailored protection for your family's safety and medical inflation.</p>
          </div>
          <div className="text-right">
             <span className="text-5xl font-black text-white italic">₹{currentSI?.label || 'N/A'}</span>
          </div>
        </article>

        {/* TENURE & DURATION */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lifecycle & Duration</h3>
          <p className="font-extrabold text-slate-900 text-xl leading-tight">{tenure} Year Selection</p>
          <div className="flex gap-4 mt-2">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">Pre: {preHosp} Days</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">Post: {postHosp} Days</span>
          </div>
        </article>

        {/* CHRONIC CONDITIONS */}
        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chronic Management</h3>
          {selectedChronic.length > 0 ? (
            <div className="space-y-2">
               <p className="font-extrabold text-orange-700 text-xl leading-tight italic">Day 31 Coverage Active</p>
               <div className="flex flex-wrap gap-2">
                {selectedChronic.map(cond => (
                  <span key={cond} className="text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-1 rounded border border-orange-200 uppercase">{cond}</span>
                ))}
               </div>
            </div>
          ) : (
            <p className="text-slate-400 italic font-bold">Standard Waiting Periods Apply</p>
          )}
        </article>
      </section>

      {/* ACTIVE BENEFITS GRID */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Shield Benefits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...activeFeatures, ...activeRiders].map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <div>
                <span className="text-[11px] font-black text-slate-900 block uppercase tracking-tight">{item.label}</span>
                <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Active</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default CustomizeReviewHealthPage;