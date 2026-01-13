import React from 'react';

const CustomizeReviewHealthPage = ({ selectionData, onConfirm, onEdit }) => {
  // Safety check for empty or loading state
  if (!selectionData || !selectionData.features) {
    return (
      <div className="p-20 text-center bg-white rounded-[3rem] shadow-inner">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest animate-pulse">
          Synchronizing Selection Data...
        </p>
      </div>
    );
  }

  const {
    currentSI,
    tenure,
    preHosp,
    postHosp,
    features = [],
    riders = [],
    selectedChronic = [],
  } = selectionData;

  const activeFeatures = features.filter((f) => f.active);
  const activeRiders = riders.filter((r) => r.active);

  return (
    <main className="p-8 space-y-10 animate-in fade-in duration-500 pb-20 bg-gradient-to-b from-white to-slate-50/50" role="main">
      
      {/* ELITE HEADER - Following Vishwa Branding Style */}
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
        <button 
          onClick={onEdit} 
          className="flex items-center gap-2 px-6 py-3 text-sm font-black text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all border border-blue-200"
        >
          ✎ Modify Plan
        </button>
      </header>

      {/* CORE PROTECTION HIGHLIGHTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
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

        <article className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lifecycle & Duration</h3>
          <p className="font-extrabold text-slate-900 text-xl leading-tight">{tenure} Year Selection</p>
          <div className="flex gap-4 mt-2">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">Pre: {preHosp} Days</span>
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">Post: {postHosp} Days</span>
          </div>
        </article>

        {/* CHRONIC CARE STATUS */}
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

      {/* PROTECTION TIMELINE - WorldWise Logic */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Protection Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-base font-extrabold text-slate-900">30 Days Initial</p>
            <p className="text-[11px] text-slate-500 leading-tight">Waiting period for all claims except accidents.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-base font-extrabold text-slate-900">Chronic Management</p>
            <p className="text-[11px] text-slate-500 leading-tight">
              {selectedChronic.length > 0 ? "Covered after 30 days for selected conditions." : "3 Years waiting for pre-existing illnesses."}
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-base font-extrabold text-slate-900">24 Months Specific</p>
            <p className="text-[11px] text-slate-500 leading-tight">Waiting for slow-growing diseases like Hernia or Cataract.</p>
          </div>
        </div>
      </section>

      {/* BENEFITS & RIDERS */}
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

      <footer className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700">
        <div className="space-y-2">
          <p className="text-2xl font-black italic">Ready to secure your future?</p>
          <p className="text-sm opacity-70 font-medium">Verify your selection and proceed to KYC documentation.</p>
        </div>
        <button 
          onClick={onConfirm}
          className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl uppercase tracking-widest italic shadow-xl transition-all active:scale-95"
        >
          Confirm & Pay →
        </button>
      </footer>
    </main>
  );
};

export default CustomizeReviewHealthPage;