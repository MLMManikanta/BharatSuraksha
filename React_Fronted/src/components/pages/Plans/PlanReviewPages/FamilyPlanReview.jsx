import React from 'react';

const FamilyShieldPlan = ({ data }) => (
  <div className="p-8 space-y-6">
    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Parivar Suraksha Review</h2>
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase">Room Category</p>
        <p className="font-bold text-slate-700">No Capping / Private Room</p>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase">Restoration</p>
        <p className="font-bold text-green-600">100% Unlimited Restore</p>
      </div>
    </div>
  </div>
);
export default FamilyShieldPlan;