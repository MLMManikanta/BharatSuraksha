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
      { disease: "Knee Joint Replacement", limit: "₹2,00,000 per Knee" },
      { disease: "Hernia / Hernioplasty", limit: is3L ? "₹80,000" : "₹90,000" },
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
    <main className="p-8 space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center border-b pb-6 border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Plan Review</h1>
          <p className="text-sm font-bold text-blue-700 uppercase tracking-widest mt-1">
            Neev Suraksha Details ({siLabel})
          </p>
        </div>
        <button 
          onClick={handleBack} 
          aria-label="Return to previous plan selection step"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-md focus:ring-4 focus:ring-slate-300"
        >
          <span>←</span>
          Go to Previous Step
        </button>
      </header>

      {/* CORE POLICY FACTORS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12" aria-label="Core Policy Details">
        
        {/* ROOM RENT */}
        <article className="space-y-2">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Room Rent Limit</h2>
          <p className="font-extrabold text-slate-900 text-xl">1% of Sum Insured</p>
          <p className="text-sm text-slate-600 italic">
            ₹{(siValue * 0.01).toLocaleString('en-IN')} / Day limit. Pro-rated deductions apply.
          </p>
        </article>

        {/* CO-PAY */}
        <article className="space-y-2">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Co-Payment</h2>
          <p className="font-extrabold text-red-700 text-xl">20% for General Hospitalization</p>
          <p className="text-sm text-slate-600">No Co-pay applicable on the specific capped treatments below.</p>
        </article>

        {/* WAITING PERIOD STATUS */}
        <article className="space-y-4">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Waiting Period Status</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-600 pl-3">
              <p className="text-lg font-extrabold text-slate-900">30 Days Initial Waiting</p>
              <p className="text-xs text-slate-600">Minimum period required before filing a claim (except accidents).</p>
            </div>
            
            <div className="border-l-4 border-blue-600 pl-3">
              <p className="text-lg font-extrabold text-slate-900">3 Years Existing Illness (PED)</p>
              <p className="text-xs text-slate-600">Wait time for pre-existing illnesses like diabetes, thyroid etc.</p>
            </div>

            <div className="border-l-4 border-blue-600 pl-3">
              <p className="text-lg font-extrabold text-slate-900">24 Months Specific Illness</p>
              <p className="text-xs text-slate-600">For slow growing diseases like knee replacement, hernia, cataract, ENT disorders, etc.</p>
            </div>
          </div>
        </article>

        {/* MATERNITY & BENEFITS */}
        <article className="space-y-2">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Maternity & Coverage</h2>
          <p className="font-extrabold text-slate-900 text-xl">{maternityLimit} Limit</p>
          <p className="text-sm text-slate-700 font-bold underline decoration-slate-300">Maternity Waiting: 3 Years.</p>
          <ul className="text-sm text-slate-700 space-y-1 mt-2 font-medium">
            <li>• Pre-Hospitalization: 30 Days</li>
            <li>• Post-Hospitalization: 60 Days</li>
            <li>• No Claim Bonus: 10% per year</li>
          </ul>
        </article>
      </section>

      {/* CAPPED TREATMENTS */}
      <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200" aria-labelledby="capped-heading">
        <h2 id="capped-heading" className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
          🛡️ Capped Treatments <span className="text-xs font-medium text-slate-600 normal-case">(No Co-Pay)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getDynamicCaps(siValue).map((item, index) => (
            <div key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-700">{item.disease}</span>
              <span className="text-xs font-black text-slate-900">{item.limit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* EXCLUSIONS SECTION */}
      <section className="bg-red-50 rounded-3xl p-8 border border-red-200" aria-labelledby="exclusions-heading">
        <h2 id="exclusions-heading" className="text-sm font-black text-red-900 uppercase tracking-widest mb-6">❌ Not Covered (Exclusions)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Global Coverage', 'Air Ambulance', 'Adventure Sports', 'Infertility / IVF', 'Cosmetic Surgery', 'Self-Inflicted Injuries', 'War & Nuclear Perils'].map((exc, i) => (
            <div key={i} className="text-xs font-bold text-red-900 bg-white p-4 rounded-xl border border-red-200 text-center uppercase shadow-sm">
              {exc}
            </div>
          ))}
          {/* ADDED CONSUMABLES EXCLUSION FOR BASIC PLAN */}
          <div className="col-span-2 text-xs font-bold text-red-900 bg-white p-4 rounded-xl border border-red-200 text-center uppercase shadow-sm italic">
            Non-Medical Expenses (Consumables)
          </div>
        </div>
      </section>
      
    </main>
  );
};

export default BasicPlanReview;