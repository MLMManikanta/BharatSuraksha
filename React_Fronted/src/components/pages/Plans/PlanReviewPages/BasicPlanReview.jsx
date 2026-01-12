import React from 'react';

const BasicPlanReview = ({ data }) => {
  const siValue = data.sumInsured?.value || 0;
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Neev Suraksha Review</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Room Rent Limit</p>
          <p className="font-bold text-slate-700">1% of Sum Insured (₹{(siValue * 0.01).toLocaleString()}/day)</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Co-Payment</p>
          <p className="font-bold text-red-600">20% Mandatory</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Maternity</p>
          <p className="font-bold text-slate-700">₹25,000 Capped</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Hospitalization</p>
          <p className="font-bold text-slate-700">30 Days Pre / 60 Days Post</p>
        </div>
      </div>
    </div>
  );
};
export default BasicPlanReview;