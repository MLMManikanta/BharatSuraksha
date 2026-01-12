import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStepper from '../../layout/CheckoutStepper';

const PlanReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect if no data is found (e.g., direct access)
  if (!state || !state.selectedPlan) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-700">No Plan Selected</h2>
        <button onClick={() => navigate('/select-plan')} className="text-[#1A5EDB] font-bold underline">
          Go back to Select Plan
        </button>
      </div>
    );
  }

  // --- 1. LOCAL STATE ---
  const [opdSelected, setOpdSelected] = useState(false);
  const [opdLimit, setOpdLimit] = useState(10000); // Default 10k

  const opdOptions = [
    { label: '₹10,000 Limit', value: 10000, price: 3500 },
    { label: '₹20,000 Limit', value: 20000, price: 6500 },
    { label: '₹50,000 Limit', value: 50000, price: 12000 },
  ];

  // --- 2. DATA DESTRUCTURING ---
  const { 
    selectedPlan, // { name: 'Family Shield', ... }
    sumInsured,   // { label: '10L', ... }
    roomRent, 
    hospitalization, 
    tenure, 
    activeFeatures = [], 
    activeRiders = [], 
    basePremium 
  } = state;

  // --- 3. CALCULATE FINAL TOTAL ---
  const calculateFinalTotal = () => {
    let total = basePremium;
    if (opdSelected) {
       const opdCost = opdOptions.find(o => o.value === opdLimit)?.price || 0;
       total += opdCost;
    }
    // Add 18% GST Estimate
    const gst = total * 0.18;
    return { total: total + gst, gst };
  };

  const { total: finalAmount, gst } = calculateFinalTotal();

  const handleProceedToKYC = () => {
    const finalData = {
      ...state,
      opd: opdSelected ? { selected: true, limit: opdLimit, price: opdOptions.find(o => o.value === opdLimit).price } : { selected: false },
      financials: {
        basePremium,
        gst,
        finalAmount
      }
    };
    
    // Navigate to Step 4 (KYC)
    navigate('/kyc', { state: finalData }); 
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
       
       {/* 1. STEPPER (Step 3 of 7) */}
       <CheckoutStepper currentStep={3} />

       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-8 max-w-7xl mx-auto">
          
          {/* HEADER */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="text-3xl font-bold text-slate-800">Review Your Policy</h1>
                <p className="text-gray-500 mt-1">Verify coverage details before proceeding to KYC.</p>
             </div>
             <div className="text-right hidden md:block">
                 <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Plan Selected</div>
                 <div className="text-xl font-bold text-[#1A5EDB]">{selectedPlan?.name || 'Custom Plan'}</div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* --- LEFT COL: TRUTH TABLE & OPD --- */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* 1. COVERAGE HIGHLIGHTS CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-700">Coverage Summary</h3>
                      <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{tenure} Year Plan</span>
                   </div>
                   
                   {/* Key Metrics */}
                   <div className="p-6 grid grid-cols-3 gap-4 text-center border-b border-gray-100">
                       <div>
                          <div className="text-xs text-gray-400 font-bold uppercase">Sum Insured</div>
                          <div className="text-lg md:text-2xl font-bold text-[#1A5EDB]">{sumInsured.label}</div>
                       </div>
                       <div>
                          <div className="text-xs text-gray-400 font-bold uppercase">Room Rent</div>
                          <div className="text-sm md:text-lg font-bold text-slate-800">{roomRent?.label || 'Standard'}</div>
                       </div>
                       <div>
                          <div className="text-xs text-gray-400 font-bold uppercase">Hospitalization</div>
                          <div className="text-sm md:text-lg font-bold text-slate-800">{hospitalization?.pre}/{hospitalization?.post} Days</div>
                       </div>
                   </div>

                   {/* THE TRUTH TABLE (Included List) */}
                   <div className="p-6">
                       <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                           Included Benefits
                       </h4>
                       <ul className="space-y-4">
                           {/* Riders First */}
                           {activeRiders.map((r, idx) => (
                              <li key={`rider-${idx}`} className="flex items-start gap-3 text-sm text-slate-700 bg-teal-50/50 p-3 rounded-lg border border-teal-100">
                                  <span className="text-teal-500 mt-0.5 text-lg">★</span>
                                  <div>
                                    <strong className="block text-teal-800">{r.label} (Rider)</strong>
                                    <span className="text-xs text-gray-500 block">{r.desc}</span>
                                    {r.isMultiSelect && (
                                        <span className="block text-[10px] text-teal-600 mt-1 font-bold">
                                            Covers: {r.selectedConditions?.join(', ')}
                                        </span>
                                    )}
                                  </div>
                              </li>
                           ))}
                           
                           {/* Standard Features */}
                           {activeFeatures.map((f, idx) => (
                              <li key={`feat-${idx}`} className="flex items-center gap-3 text-sm text-slate-700">
                                  <span className="text-green-500">●</span>
                                  <span>{f.label}</span>
                              </li>
                           ))}
                       </ul>
                   </div>
                </div>

                {/* 2. OPTIONAL OPD MODULE */}
                <div 
                  onClick={() => setOpdSelected(!opdSelected)}
                  className={`relative rounded-2xl border-2 transition-all cursor-pointer p-6 ${
                     opdSelected ? 'border-[#1A5EDB] bg-blue-50/30' : 'border-gray-200 hover:border-blue-200 hover:bg-white'
                  }`}
                >
                   <div className="flex justify-between items-start">
                       <div className="flex gap-4">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                               opdSelected ? 'bg-blue-100 text-[#1A5EDB]' : 'bg-gray-100 text-gray-400'
                           }`}>
                               🏥
                           </div>
                           <div>
                               <h3 className={`font-bold text-lg ${opdSelected ? 'text-[#1A5EDB]' : 'text-gray-700'}`}>
                                   Add OPD Coverage?
                               </h3>
                               <p className="text-sm text-gray-500 max-w-md">
                                   Covers doctor consultations, pharmacy, and diagnostics (out-patient) expenses.
                               </p>
                           </div>
                       </div>

                       {/* Toggle Checkbox UI */}
                       <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                           opdSelected ? 'bg-[#1A5EDB] border-[#1A5EDB]' : 'bg-white border-gray-300'
                       }`}>
                           {opdSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                       </div>
                   </div>

                   {/* OPD DROPDOWN (Conditional) */}
                   {opdSelected && (
                       <div className="mt-6 pl-0 md:pl-16 animate-in fade-in slide-in-from-top-2">
                           <label className="text-xs font-bold text-[#1A5EDB] uppercase mb-2 block">Select OPD Limit</label>
                           <select 
                               value={opdLimit} 
                               onClick={(e) => e.stopPropagation()} // Prevent card toggle
                               onChange={(e) => setOpdLimit(Number(e.target.value))}
                               className="w-full md:w-1/2 p-3 rounded-xl border border-blue-200 bg-white text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                           >
                               {opdOptions.map(opt => (
                                   <option key={opt.value} value={opt.value}>
                                       {opt.label} (+₹{opt.price.toLocaleString()})
                                   </option>
                               ))}
                           </select>
                       </div>
                   )}
                </div>

             </div>

             {/* --- RIGHT COL: STICKY SUMMARY --- */}
             <div className="lg:col-span-1">
                 <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-gray-100 pb-4">Payment Breakdown</h3>

                    <div className="space-y-3 mb-6 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Base Premium</span>
                            <span className="font-bold text-slate-800">₹{basePremium.toLocaleString()}</span>
                        </div>
                        
                        {/* Show OPD line item if selected */}
                        {opdSelected && (
                            <div className="flex justify-between text-[#1A5EDB] bg-blue-50 p-2 rounded">
                                <span>OPD Add-on</span>
                                <span className="font-bold">
                                    +₹{opdOptions.find(o => o.value === opdLimit)?.price.toLocaleString()}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between text-gray-500">
                            <span>GST (18%)</span>
                            <span>₹{Math.round(gst).toLocaleString()}</span>
                        </div>

                        <div className="border-t border-dashed border-gray-200 my-2"></div>

                        <div className="flex justify-between items-end">
                            <span className="text-slate-800 font-bold text-lg">Total Payable</span>
                            <span className="text-2xl font-bold text-[#1A5EDB]">
                                ₹{Math.round(finalAmount).toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>

                    <button 
                       onClick={handleProceedToKYC}
                       className="w-full py-4 bg-[#1A5EDB] text-white font-bold rounded-xl shadow-lg hover:bg-[#1149AE] transition-all transform active:scale-[0.99] flex justify-center items-center gap-2"
                    >
                       Proceed to KYC
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                    
                    <button onClick={() => navigate(-1)} className="w-full mt-4 text-gray-400 font-bold text-xs hover:text-gray-600">
                       &larr; Go Back to Customization
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                       Secure SSL Encrypted Transaction
                    </div>
                 </div>
             </div>

          </div>
       </div>
    </div>
  );
};

export default PlanReviewPage;