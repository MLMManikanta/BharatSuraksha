import React from 'react';

const CustomizeReviewHealthPage = ({ selectionData, onConfirm, onEdit }) => {
  // Safety check: If selectionData is missing, don't show "No Data Found", show a loader or return null
  if (!selectionData || !selectionData.features) {
    return (
      <div className="p-20 text-center">
        <p className="text-slate-400 font-bold uppercase animate-pulse">Loading Selection Data...</p>
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

  // Filter active items for display
  const activeFeatures = features.filter((f) => f.active);
  const activeRiders = riders.filter((r) => r.active);

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-8 bg-gray-50 min-h-screen font-sans" role="main">
      {/* HEADER */}
      <header className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl border-b-4 border-blue-600">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Review Your Shield</h1>
        <p className="text-blue-200 text-sm font-bold uppercase mt-1">Final check of your Vajra Suraksha Plan</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b pb-2">
              Core Protection
            </h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Sum Insured</span>
                <span className="text-2xl font-black text-blue-800">₹{currentSI?.label || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Policy Tenure</span>
                <span className="text-2xl font-black text-blue-800">{tenure} Year(s)</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Pre-Hospitalisation</span>
                <span className="text-lg font-bold text-slate-700">{preHosp} Days</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block">Post-Hospitalisation</span>
                <span className="text-lg font-bold text-slate-700">{postHosp} Days</span>
              </div>
            </div>
          </div>

          {selectedChronic.length > 0 && (
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200 shadow-sm">
              <h2 className="text-sm font-bold text-orange-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>💊</span> Chronic Care (Day 31+)
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedChronic.map((cond) => (
                  <span key={cond} className="px-3 py-1 bg-white border border-orange-200 rounded-full text-xs font-bold text-orange-700 shadow-sm">
                    {cond}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b pb-2">
              Benefits & Add-ons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...activeFeatures, ...activeRiders].map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{item.label}</span>
                    {item.isLocked && <span className="text-[10px] text-blue-600 font-bold uppercase">Included</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 sticky top-6">
            <h2 className="font-black text-slate-900 uppercase text-xl border-b pb-4 mb-6">Total Check</h2>
            <button 
              onClick={onConfirm}
              className="w-full py-5 bg-blue-700 text-white font-black rounded-xl uppercase tracking-widest italic shadow-xl hover:bg-blue-800 transition-all active:scale-95"
            >
              Buy Now &rarr;
            </button>
            <button 
              onClick={onEdit}
              className="w-full mt-3 py-4 bg-white text-slate-500 font-bold rounded-xl uppercase tracking-widest text-xs border border-slate-200"
            >
              Modify Plan
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CustomizeReviewHealthPage;