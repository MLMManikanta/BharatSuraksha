import React from 'react';
import { useNavigate } from 'react-router-dom';

const BasicPlanReview = ({ data }) => {
  const navigate = useNavigate();
  const siValue = data.sumInsured?.value || 0;
  const siLabel = data.sumInsured?.label || "₹3L";

  // --- 1. DYNAMIC TREATMENT CAPS (Scale with SI) ---
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

  // --- 2. DYNAMIC MATERNITY CAP ---
  const maternityLimit = (() => {
    if (siValue <= 300000) return "₹25,000";
    if (siValue <= 400000) return "₹30,000";
    return "₹37,000"; 
  })();

  // --- 3. UPDATED BACK NAVIGATION ---
  const handleBack = () => {
    navigate('/select-plan', { 
        state: { 
            ...data, 
            activeTab: data.selectedPlan?.name.toLowerCase().includes('parivar') ? 'parivar' : 'neev' 
        } 
    });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER WITH UPDATED BACK UI */}
      <div className="flex justify-between items-center border-b pb-6 border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Plan Review</h2>
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Neev Suraksha Details ({siLabel})</p>
        </div>
        <button 
          onClick={handleBack} 
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-all shadow-md group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Go to Previous Step
        </button>
      </div>

      {/* CORE POLICY FACTORS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Rent Limit</p>
          <p className="font-bold text-slate-800 text-lg">1% of Sum Insured</p>
          <p className="text-xs text-slate-500">₹{(siValue * 0.01).toLocaleString('en-IN')} / Day limit. Pro-rated deductions apply if exceeded.</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Co-Payment</p>
          <p className="font-bold text-red-600 text-lg">20% for General Hospitalization</p>
          <p className="text-xs text-slate-500 italic">No Co-pay applicable on the specific capped treatments below.</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maternity Benefit</p>
          <p className="font-bold text-slate-800 text-lg">{maternityLimit} Limit</p>
          <p className="text-xs text-slate-500 underline font-bold">Waiting Period: 3 Years.</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic Benefits</p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>• Pre-Hospitalization: 30 Days</li>
            <li>• Post-Hospitalization: 60 Days</li>
            <li>• No Claim Bonus: 10% per year</li>
            <li>• Ambulance Cover: Up to ₹5,000</li>
          </ul>
        </div>
      </div>

      {/* CAPPED TREATMENTS */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">🛡️ Capped Treatments (No Co-Pay)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {getDynamicCaps(siValue).map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <span className="text-[11px] font-bold text-slate-600">{item.disease}</span>
              <span className="text-[11px] font-black text-slate-900">{item.limit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* EXCLUSIONS */}
      <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
        <h3 className="text-xs font-black text-red-900 uppercase tracking-widest mb-4">❌ Not Covered</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Global Coverage', 'Air Ambulance', 'Adventure Sports', 'Infertility / IVF', 'Cosmetic Surgery', 'Self-Inflicted Injuries', 'War & Nuclear'].map((exc, i) => (
            <div key={i} className="text-[10px] font-bold text-red-700 bg-white/60 p-3 rounded-xl border border-red-200 text-center">
              {exc}
            </div>
          ))}
          <div className="col-span-2 text-[10px] font-black text-red-700 bg-white/60 p-3 rounded-xl border border-red-200 text-center flex items-center justify-center uppercase italic">
            Non-Medical Expenses (Consumables)
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default BasicPlanReview;