import React from 'react';

const CustomizeHealthPage = ({ data }) => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Vajra Suraksha Review</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Custom Room Rent</p>
          <p className="font-bold text-slate-700">{data.roomRent?.label || "Selected Limit"}</p>
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">Hospitalization</p>
          <p className="font-bold text-slate-700">{data.hospitalization?.pre || 60} Pre / {data.hospitalization?.post || 90} Post</p>
        </div>
      </div>
    </div>
  );
};
export default CustomizeHealthPage;