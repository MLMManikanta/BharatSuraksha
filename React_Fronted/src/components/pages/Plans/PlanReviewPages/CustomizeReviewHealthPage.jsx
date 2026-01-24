import React from 'react';

const CustomizeReviewHealthPage = ({ selectionData, onConfirm, onEdit }) => {
  
  // --- 1. SAFETY CHECK: Missing Data ---
  if (!selectionData || !selectionData.features) {
    return (
      <div className="p-20 text-center bg-white rounded-[3rem] shadow-xl border border-red-50 animate-fade-in-up">
        <div className="text-6xl mb-6">⚠️</div>
        <p className="text-red-500 font-black uppercase tracking-widest text-lg mb-2">
          Configuration Missing
        </p>
        <p className="text-xs text-gray-400 font-bold uppercase mb-8">
          Please return to the builder to customize your plan.
        </p>
        <button 
          onClick={onEdit}
          className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black uppercase rounded-full transition-all tracking-wide"
        >
          ← Return to Builder
        </button>
      </div>
    );
  }

  // --- 2. DESTRUCTURE DATA ---
  const {
    currentSI,
    tenure,
    preHosp,
    postHosp,
    features = [],
    riders: ridersData = [],
    selectedChronic = [],
  } = selectionData;

   // Normalize riders in both array and object formats so rendering is consistent
   // Supported shapes: string ids, { id, label, active, desc, icon }, or object bundles { selectedRiders, addons }
   const normalizeRider = (raw) => {
      if (!raw && raw !== 0) return null;
      if (typeof raw === 'string') {
         const id = raw;
         const label = String(raw).replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
         return { id, label, desc: '', active: true, icon: null };
      }
      const id = raw.id || raw.name || raw.label || '';
      const label = raw.label || raw.name || raw.id || '';
      const desc = raw.desc || raw.description || '';
      const active = (raw.active !== false) && (raw.selected !== false);
      const icon = raw.icon || null;
      if (!id && !label) return null;
      return { id: String(id), label: label || String(id), desc, active, icon };
   };

   let rawRiders = [];
   if (Array.isArray(ridersData)) rawRiders = ridersData;
   else if (ridersData && typeof ridersData === 'object') rawRiders = [
      ...(ridersData.selectedRiders || []),
      ...(ridersData.addons || []),
      ...(ridersData.selectedFeatures || [])
   ];

   // Normalize and dedupe by id (preserve first occurrence)
   const seen = new Set();
   const processedRiders = rawRiders
      .map(normalizeRider)
      .filter(r => r && r.id)
      .filter(r => {
         const nid = String(r.id).toLowerCase();
         if (seen.has(nid)) return false;
         seen.add(nid);
         return true;
      });

   const activeFeatures = features.filter((f) => f && f.active !== false);
   const activeRiders = processedRiders.filter((r) => r && r.active !== false);

  return (
    <main className="w-full font-sans animate-fade-in-up">
      
      {/* HEADER */}
      <div className="bg-slate-900 p-8 rounded-t-3xl text-white shadow-2xl flex justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600/30 backdrop-blur-md text-blue-100 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-blue-500/50">
              CUSTOM CONFIGURATION
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight italic mb-1">Vajra Suraksha</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-300 opacity-90 uppercase tracking-widest">Custom Review ({currentSI?.label || 'N/A'})</span>
          </div>
        </div>
        
        <button 
          onClick={onEdit} 
          className="relative z-10 flex items-center gap-2 px-6 py-2.5 text-xs font-black text-slate-900 bg-white hover:bg-blue-50 rounded-xl shadow-lg transition-all active:scale-95"
        >
          <span>✎</span> Modify
        </button>
      </div>

      <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-gray-100 p-6 md:p-8 space-y-10">
        
        {/* CORE PROTECTION HIGHLIGHTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
           <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-100"></div>

           <div className="space-y-8">
              {/* SUM INSURED CARD */}
              <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
                 <div className="relative z-10 flex justify-between items-center">
                    <div>
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Total Coverage</h3>
                       <p className="text-sm font-medium text-blue-100">Annual Sum Insured</p>
                    </div>
                    <div className="text-right">
                       <span className="text-4xl font-black italic tracking-tight">₹{currentSI?.label || 'N/A'}</span>
                    </div>
                 </div>
                 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              </article>

              {/* TENURE & DURATION */}
              <article>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Policy Duration</h3>
                 <div className="flex items-center gap-4">
                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                       <span className="block text-2xl font-black text-slate-800 leading-none">{tenure}</span>
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Years</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex justify-between items-center text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <span>Pre-Hospitalization</span>
                          <span className="text-blue-600">{preHosp} Days</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <span>Post-Hospitalization</span>
                          <span className="text-blue-600">{postHosp} Days</span>
                       </div>
                    </div>
                 </div>
              </article>
           </div>

           <div className="space-y-8">
              {/* CHRONIC CONDITIONS */}
              <article>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    Chronic Management <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">Day 31 Cover</span>
                 </h3>
                 {selectedChronic.length > 0 ? (
                    <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100">
                       <div className="flex flex-wrap gap-2">
                          {selectedChronic.map(cond => (
                             <span key={cond} className="text-[10px] font-black bg-white text-orange-800 px-3 py-1.5 rounded-lg border border-orange-200 uppercase shadow-sm">
                                {cond}
                             </span>
                          ))}
                       </div>
                       <p className="text-[10px] text-orange-700/70 font-bold mt-3 uppercase tracking-wide">
                          * Waiting period waived for listed conditions
                       </p>
                    </div>
                 ) : (
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-center">
                       <p className="text-sm font-bold text-gray-400 italic">Standard Waiting Periods Apply</p>
                       <p className="text-[10px] text-gray-400 mt-1 uppercase">No chronic conditions selected</p>
                    </div>
                 )}
              </article>

              {/* RIDERS SUMMARY */}
              <article>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Active Add-ons</h3>
                 <div className="bg-teal-50/50 rounded-2xl p-1 border border-teal-100">
                      {/* Show a curated list of premium riders and mark selected ones */}
                      {(() => {
                               const premiumRidersList = [
                                  { id: 'unlimited_care', label: 'Unlimited Care Package', desc: 'Expanded coverages and limits for major events', icon: '🛡️' },
                                  { id: 'inflation_shield', label: 'Inflation Shield', desc: 'Index-linked inflation protection for sum insured', icon: '📈' },
                                  { id: 'tele_consult', label: 'Tele-Consultation', desc: 'Unlimited telemedicine consultations', icon: '📞' },
                                  { id: 'smart_agg', label: 'Smart Aggregate', desc: 'Choose 2Y or 3Y aggregate option', icon: '🔁' },
                                  { id: 'super_bonus', label: 'Super Bonus (7x)', desc: 'Additional sum insured on claim-free years', icon: '⭐' },
                                  { id: 'maternity_boost', label: 'Maternity Booster', desc: 'Up to 10% (max ₹5,00,000), min 2 year waiting', icon: '🤰' },
                                  { id: 'ped_wait', label: 'PED Wait Reduction', desc: 'Reduce PED waiting period (3y → 2y / 1y)', icon: '⏳' },
                                  { id: 'specific_wait', label: 'Specific Disease Wait Reduction', desc: 'Reduce waiting for listed illnesses', icon: '⚕️' }
                               ];

                               const normalize = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                               // Build selected set considering variants
                               const selectedIds = new Set();
                               (processedRiders || []).forEach(r => {
                                  if (!r) return;
                                  if (r.id === 'smart_agg' && r.selectedVariant) selectedIds.add(normalize('smart_agg:' + r.selectedVariant));
                                  else if (r.id === 'ped_wait' && r.selectedVariant) selectedIds.add(normalize('ped_wait:' + r.selectedVariant));
                                  else selectedIds.add(normalize(r.id));
                               });

                               return (
                                  <div className="divide-y divide-teal-100/50">
                                     {premiumRidersList.map(p => {
                                        // Compute selected badge text for merged riders
                                        let badge = null;
                                        if (p.id === 'smart_agg') {
                                           const r = (processedRiders || []).find(x => x.id === 'smart_agg');
                                           if (r && r.active) badge = r.selectedVariant === '2y' ? '2Y' : (r.selectedVariant === '3y' ? '3Y' : 'Selected');
                                        }
                                        if (p.id === 'ped_wait') {
                                           const r = (processedRiders || []).find(x => x.id === 'ped_wait');
                                           if (r && r.active) badge = r.selectedVariant === '2y' ? '3→2y' : (r.selectedVariant === '1y' ? '3→1y' : 'Selected');
                                        }

                                        const isSelected = selectedIds.has(normalize(p.id)) || !!badge;
                                        return (
                                           <div key={p.id} className="flex items-center gap-3 p-3">
                                                <span className="text-lg">{p.icon}</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                       <p className="text-[11px] font-black text-teal-900 uppercase leading-none">{p.label}</p>
                                                       {badge ? <span className="text-[10px] font-bold text-white bg-teal-600 px-2 py-0.5 rounded-full">{badge}</span> : isSelected && <span className="text-[10px] font-bold text-white bg-teal-600 px-2 py-0.5 rounded-full">Selected</span>}
                                                    </div>
                                                    <p className="text-[9px] font-bold text-teal-600/80 mt-0.5">{p.desc}</p>
                                                </div>
                                           </div>
                                        );
                                     })}
                                  </div>
                               );
                      })()}
                 </div>
              </article>
           </div>
        </section>

        {/* ACTIVE BENEFITS GRID */}
        <section>
           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
              Included Shield Benefits
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {activeFeatures.map((item) => (
                 <div key={item.id} className="group flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                    <span className="text-[10px] font-black text-gray-700 text-center uppercase leading-tight group-hover:text-blue-800 transition-colors">
                       {item.label}
                    </span>
                 </div>
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

export default CustomizeReviewHealthPage;