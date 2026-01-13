import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSummary = ({ data }) => {
  const navigate = useNavigate();
  
  // Safeguard if data is not yet loaded
  if (!data) return null;

  return (
    <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-2xl space-y-8 sticky top-6">
      <div className="border-b border-slate-700 pb-6">
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Payment Summary</p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Selected Plan</span>
            <span className="font-bold">{data.selectedPlan?.name || 'Neev Suraksha'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Base Premium</span>
            <span className="font-bold">₹{data.basePremium?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-slate-400">GST Status</span>
            <span className="text-green-400 font-black text-xs bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
              0% (NIL)
            </span>
          </div>
        </div>
      </div>

      <div className="text-center md:text-left">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Annual Premium</p>
        <h3 className="text-5xl font-black italic tracking-tighter text-white">
          ₹{data.basePremium?.toLocaleString('en-IN')}
        </h3>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => navigate('/proposal-form', { state: data })}
          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-blue-500/20"
        >
          Proceed to KYC →
        </button>
        <p className="text-[9px] text-center text-slate-500 uppercase font-bold tracking-widest opacity-60 leading-relaxed">
          GST exempt for Individual Health Insurance from Sep 22, 2025.
        </p>
      </div>
    </div>
  );
};

export default PaymentSummary;