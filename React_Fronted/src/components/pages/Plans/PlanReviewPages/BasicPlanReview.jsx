import React from 'react';
import { useNavigate } from 'react-router-dom';

const BasicPlanReview = ({ data }) => {
  const navigate = useNavigate();
  const siValue = data?.sumInsured?.value || 0;
  const siLabel = data?.sumInsured?.label || "₹3L";

  // --- 1. DYNAMIC TREATMENT CAPS ---
  const getDynamicCaps = (si) => {
    const is3L = si <= 300000;
    const is4L = si > 300000 && si <= 400000;

    return [
      { disease: "Cataract", limit: is3L ? "₹35,000 per Eye" : is4L ? "₹40,000 per Eye" : "₹45,000 per Eye" },
      { disease: "Hysterectomy", limit: is3L ? "₹75,000" : is4L ? "₹85,000" : "₹95,000" },
      { disease: "Piles / Fistulas", limit: is3L ? "₹50,000" : "₹60,000" },
      { disease: "Knee Replacement", limit: "₹2,00,000 per Knee" },
      { disease: "Hernia", limit: is3L ? "₹80,000" : "₹90,000" },
      { disease: "Bariatric Surgery", limit: "₹2,00,000" }
    ];
  };

  const maternityLimit = (() => {
    if (siValue <= 300000) return "₹25,000";
    if (siValue <= 400000) return "₹30,000";
    return "₹37,000"; 
  })();

  const handleBack = () => {
    navigate('/select-plan', { 
        state: { 
            ...data, 
            activeTab: data.selectedPlan?.name.toLowerCase().includes('parivar') ? 'parivar' : 'neev' 
        } 
    });
  };

  return (
    <main className="w-full font-sans animate-fade-in-up pb-1">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-8 rounded-t-3xl text-white shadow-lg flex justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black uppercase tracking-tight mb-1">Plan Review</h1>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase backdrop-blur-sm">Neev Suraksha</span>
            <span className="text-sm font-bold opacity-90">{siLabel} Sum Insured</span>
          </div>
        </div>
        
        <button 
          onClick={handleBack} 
          aria-label="Return to previous plan selection step"
          className="relative z-10 flex items-center gap-2 px-4 py-2 text-xs font-bold text-cyan-800 bg-white hover:bg-cyan-50 rounded-xl transition-all shadow-md active:scale-95"
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
                 <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-xl shrink-0">🏥</div>
                 <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Room Rent Limit</h2>
                    <p className="font-extrabold text-gray-800 text-lg">1% of Sum Insured</p>
                    <p className="text-xs text-cyan-600 font-medium bg-cyan-50 inline-block px-2 py-1 rounded mt-1">
                      ₹{(siValue * 0.01).toLocaleString('en-IN')} / Day limit
                    </p>
                 </div>
              </article>

              {/* CO-PAY */}
              <article className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-xl shrink-0">📉</div>
                 <div>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Co-Payment</h2>
                    <p className="font-extrabold text-red-600 text-lg">20% General</p>
                    <p className="text-xs text-gray-400 mt-1">Applicable on general hospitalization.</p>
                 </div>
              </article>
           </div>

           <div className="space-y-6">
              {/* WAITING PERIOD STATUS */}
              <article>
                 <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Waiting Periods
                 </h2>
                 <div className="space-y-3 pl-2 border-l-2 border-gray-100 ml-1">
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">30 Days</p>
                        <p className="text-xs text-gray-500">Initial Waiting Period</p>
                    </div>
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">3 Years</p>
                        <p className="text-xs text-gray-500">Pre-Existing Diseases (PED)</p>
                    </div>
                    <div className="pl-4 relative">
                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-300"></div>
                        <p className="text-sm font-bold text-gray-800">24 Months</p>
                        <p className="text-xs text-gray-500">Specific Slow-Growing Illnesses</p>
                    </div>
                 </div>
              </article>
           </div>
        </section>

        {/* MATERNITY & BENEFITS BANNER */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 border border-pink-100 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl">🤰</div>
              <div>
                 <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Maternity Limit</h3>
                 <p className="text-2xl font-black text-pink-600">{maternityLimit}</p>
                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">3 Years Waiting Period</p>
              </div>
           </div>
           <div className="flex gap-4 text-xs font-medium text-gray-600 bg-white/60 px-4 py-2 rounded-xl">
              <div className="text-center">
                 <span className="block font-bold text-gray-800">30 Days</span>
                 <span>Pre-Hosp</span>
              </div>
              <div className="w-px bg-gray-300"></div>
              <div className="text-center">
                 <span className="block font-bold text-gray-800">60 Days</span>
                 <span>Post-Hosp</span>
              </div>
           </div>
        </div>

        {/* CAPPED TREATMENTS */}
        <section aria-labelledby="capped-heading">
           <h2 id="capped-heading" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              🛡️ Capped Treatments <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">No Co-Pay</span>
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {getDynamicCaps(siValue).map((item, index) => (
                 <div key={index} className="flex flex-col p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-cyan-200 transition-colors">
                    <span className="text-xs font-bold text-gray-500 uppercase mb-1">{item.disease}</span>
                    <span className="text-sm font-black text-slate-800">{item.limit}</span>
                 </div>
              ))}
           </div>
        </section>

        {/* EXCLUSIONS SECTION */}
        <section aria-labelledby="exclusions-heading">
           <h2 id="exclusions-heading" className="text-xs font-bold text-red-400 uppercase tracking-widest mb-4">❌ Exclusions</h2>
           <div className="flex flex-wrap gap-2">
              {['Global Coverage', 'Air Ambulance', 'Adventure Sports', 'Infertility / IVF', 'Cosmetic Surgery', 'Self-Inflicted', 'War Perils', 'Non-Medical (Consumables)'].map((exc, i) => (
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

export default BasicPlanReview;