import React, { useState, useEffect } from 'react';

const CustomizeHealthPage = ({ members, proposer, onBack }) => {

  // --- 1. DATA CONFIGURATION ---
  
  const sumInsuredSteps = [
    { label: "₹10L", value: 1000000 },
    { label: "₹15L", value: 1500000 },
    { label: "₹20L", value: 2000000 },
    { label: "₹35L", value: 3500000 },
    { label: "₹50L", value: 5000000 },
    { label: "₹1Cr", value: 10000000 },
    { label: "₹2Cr", value: 20000000 },
    { label: "₹5Cr", value: 50000000 },
    { label: "Unlimited", value: 999999999 } 
  ];

  const roomRentOptions = [
    { label: "₹5,000 / Day", value: "5k" },
    { label: "₹7,500 / Day", value: "7.5k" },
    { label: "₹10,000 / Day", value: "10k" },
    { label: "Single Private Room", value: "private" },
    { label: "Single Private AC Room", value: "private_ac" },
    { label: "Deluxe Room", value: "deluxe" },
    { label: "Any Room Category", value: "any" }
  ];

  const chronicDiseases = [
    "Diabetes",
    "High Cholesterol",
    "COPD",
    "Heart Disease",
    "Hypertension",
    "Asthma"
  ];

  const initialFeatures = [
    { id: 'global', label: 'Global Coverage', icon: '🌍', active: false, price: 2000 },
    { id: 'restore', label: 'Automatic Restore', icon: '🔄', active: true, price: 0 }, 
    { id: 'claim_protect', label: 'Claim Protector', icon: '🛡️', active: false, price: 800 }, 
    { id: 'dme', label: 'DME Cover', icon: '🦽', active: false, price: 500 }, 
    { id: 'air_ambulance', label: 'Air Ambulance', icon: '🚁', active: false, price: 1500 },
    { id: 'health_check', label: 'Free Health Checkup', icon: '🩺', active: true, price: 0 },
    { id: 'ayush', label: 'AYUSH Benefits', icon: '🌿', active: true, price: 0 },
    { id: 'domiciliary', label: 'Domiciliary Expenses', icon: '🏠', active: true, price: 0 },
    { id: 'opd', label: 'OPD Care', icon: '🏥', active: false, price: 3000 },
  ];

  // Premium Riders
  const initialRiders = [
    { 
      id: 'unlimited_care', 
      label: 'Unlimited Care', 
      desc: 'Never run out of cover.', 
      icon: '♾️', 
      active: false, 
      price: 25000
    },
    { 
      id: 'chronic_care', 
      label: 'Chronic Care', 
      desc: 'Day 1 cover for managed conditions', 
      icon: '💊', 
      active: false, 
      price: 4000, 
      isMultiSelect: true, 
      selectedConditions: ['Diabetes'] 
    },
    { 
      id: 'tele_consult', 
      label: 'Tele-Consultation', 
      desc: 'Unlimited online doctor consults 24/7', 
      icon: '📲', 
      active: false, 
      price: 1500 
    },
    { 
      id: 'flexi_year', 
      label: 'Smart Aggregate', 
      desc: 'Unlock total tenure cover in 1st Year', 
      icon: '📅', 
      active: false, 
      price: 5000, 
      minTenure: 2 
    },
    { 
      id: 'super_bonus', 
      label: 'Super Bonus', 
      desc: '7x Coverage irrespective of claims', 
      icon: '🚀', 
      active: false, 
      price: 8000
    },
    { 
      id: 'ped_wait', 
      label: 'PED Wait Reduction', 
      desc: 'Reduce Pre-existing disease wait to 1 Yr', 
      icon: '📉', 
      active: false, 
      price: 6000 
    },
    { 
      id: 'specific_disease', 
      label: 'Specific Disease Wait', 
      desc: 'Modify waiting period for listed illnesses', 
      icon: '📋', 
      active: false, 
      price: 1200 
    },
    { 
      id: 'maternity_boost', 
      label: 'Maternity Booster', 
      desc: 'Up to ₹3L Worldwide Limit', 
      icon: '🤰', 
      active: false, 
      price: 12000 
    }
  ];

  // --- 2. STATE ---
  const [sliderIndex, setSliderIndex] = useState(0); 
  const [roomRent, setRoomRent] = useState("private");
  const [preHospitalization, setPreHospitalization] = useState(60);
  const [postHospitalization, setPostHospitalization] = useState(90);
  const [tenure, setTenure] = useState(1);
  
  const [features, setFeatures] = useState(initialFeatures);
  const [riders, setRiders] = useState(initialRiders);

  // --- 3. EFFECTS & LOGIC ---

  const isBaseUnlimited = sumInsuredSteps[sliderIndex].value === 999999999;

  useEffect(() => {
    // 1. Feature Updates
    setFeatures(prev => prev.map(f => {
      if (f.id === 'restore') {
         if (isBaseUnlimited) {
           return { ...f, active: false, isDisabledByBase: true };
         } else {
           return { ...f, isDisabledByBase: false };
         }
      }
      return f;
    }));

    // 2. Rider Updates
    setRiders(prev => prev.map(r => {
      // Logic A: Unlimited Base Sum Insured disables specific riders
      if (['unlimited_care', 'super_bonus', 'flexi_year'].includes(r.id)) {
        if (isBaseUnlimited) {
          return { ...r, active: false, isDisabledByBase: true };
        } else {
          if (r.id !== 'flexi_year') {
             return { ...r, isDisabledByBase: false };
          }
        }
      }

      // Logic B: Tenure Check for Smart Aggregate
      if (r.id === 'flexi_year') {
        if (isBaseUnlimited) return { ...r, active: false, isDisabledByBase: true };
        if (tenure < r.minTenure) {
           return { ...r, active: false, isDisabledByBase: false }; 
        } else {
           return { ...r, isDisabledByBase: false };
        }
      }
      
      return r;
    }));

  }, [sliderIndex, tenure, isBaseUnlimited]); 


  // --- 4. HANDLERS ---
  
  const toggleFeature = (id) => {
    setFeatures(prev => prev.map(f => {
      if (f.isDisabledByBase) return f;
      return f.id === id ? { ...f, active: !f.active } : f;
    }));
  };

  const toggleRider = (id) => {
    setRiders(prev => prev.map(r => {
      if (r.id === id) {
        if (r.isDisabledByBase) return r; 
        
        // Tenure Check
        if (r.minTenure && tenure < r.minTenure) {
          alert(`This rider requires a policy tenure of at least ${r.minTenure} years.`);
          return r;
        }

        return { ...r, active: !r.active };
      }
      return r;
    }));
  };

  // Logic to calculate dynamic price for Chronic Care
  const getChronicPrice = (count) => {
      if (count === 0) return 0;
      if (count === 1) return 4000;
      if (count === 2) return 7500; // Discounted combo
      return 7500 + ((count - 2) * 3000); // 3000 for every additional
  };

  const toggleChronicCondition = (condition, event) => {
    event.stopPropagation();
    
    setRiders(prev => prev.map(r => {
        if (r.id === 'chronic_care') {
            const currentList = r.selectedConditions || [];
            let newList;
            
            if (currentList.includes(condition)) {
                // Remove (prevent removing last one if active)
                if (currentList.length === 1) {
                    alert("At least one condition must be selected.");
                    newList = currentList;
                } else {
                    newList = currentList.filter(c => c !== condition);
                }
            } else {
                // Add
                newList = [...currentList, condition];
            }
            
            // Recalculate price
            return { 
                ...r, 
                selectedConditions: newList, 
                price: getChronicPrice(newList.length) 
            };
        }
        return r;
    }));
  };

  const calculatePremium = () => {
    let base = 12000;
    base += sliderIndex * 2500;
    if (roomRent === 'deluxe' || roomRent === 'any') base += 4000;
    if (roomRent === 'private_ac') base += 2000;
    if (preHospitalization === 90) base += 500;
    if (postHospitalization === 180) base += 1000;
    features.forEach(f => { if (f.active) base += f.price; });
    riders.forEach(r => { if (r.active) base += r.price; });
    if (tenure === 2) base = base * 2 * 0.9;
    if (tenure === 3) base = base * 3 * 0.85;
    return Math.round(base).toLocaleString('en-IN');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. SUM INSURED */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1A5EDB] flex items-center justify-center text-sm">₹</span> 
                Sum Insured
              </h2>
              <span className="text-3xl font-bold text-[#1A5EDB]">{sumInsuredSteps[sliderIndex].label}</span>
            </div>
            
            <div className="px-2 relative pt-2 pb-6">
              <input 
                type="range" min="0" max={sumInsuredSteps.length - 1} step="1"
                value={sliderIndex} onChange={(e) => setSliderIndex(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1A5EDB] relative z-10"
              />
              <div className="flex justify-between mt-3 absolute w-full left-0 top-4 px-1 pointer-events-none">
                {sumInsuredSteps.map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-0.5 h-2 ${i === sliderIndex ? 'bg-[#1A5EDB]' : 'bg-gray-300'}`}></div>
                        {(i === 0 || i === sumInsuredSteps.length - 1 || i === sliderIndex) && (
                            <span className={`text-[10px] font-bold ${i === sliderIndex ? 'text-[#1A5EDB]' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        )}
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. ROOM RENT & HOSPITALIZATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1A5EDB] flex items-center justify-center text-xl">🏥</span> 
                Room Rent Limit
              </h2>
              <select value={roomRent} onChange={(e) => setRoomRent(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 font-bold text-slate-700 bg-gray-50 focus:border-[#1A5EDB] outline-none">
                {roomRentOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1A5EDB] flex items-center justify-center text-xl">📅</span> 
                Hospitalization
              </h2>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Pre-Hospitalization</span>
                  <div className="flex gap-2 mt-2">
                    {[30, 60, 90].map(days => (
                      <button key={days} onClick={() => setPreHospitalization(days)} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${preHospitalization === days ? 'bg-[#1A5EDB] text-white' : 'text-gray-500'}`}>{days} Days</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase">Post-Hospitalization</span>
                  <div className="flex gap-2 mt-2">
                    {[60, 90, 180].map(days => (
                      <button key={days} onClick={() => setPostHospitalization(days)} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${postHospitalization === days ? 'bg-[#1A5EDB] text-white' : 'text-gray-500'}`}>{days} Days</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FEATURES */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1A5EDB] flex items-center justify-center text-xl">✨</span> 
              Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature) => {
                const isDisabled = feature.isDisabledByBase;
                return (
                  <div 
                    key={feature.id}
                    onClick={() => !isDisabled && toggleFeature(feature.id)}
                    className={`relative p-3 rounded-xl border transition-all duration-200 text-center ${
                      isDisabled ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' :
                      feature.active ? 'border-[#1A5EDB] bg-blue-50/50 cursor-pointer' : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {isDisabled && <div className="absolute top-2 right-2 text-xs">🔒</div>}
                    <div className="text-2xl mb-1">{feature.icon}</div>
                    <h3 className={`text-xs font-bold leading-tight ${feature.active ? 'text-[#1A5EDB]' : 'text-slate-700'}`}>
                      {feature.label}
                    </h3>
                    
                    {feature.isDisabledByBase && (
                        <span className="text-[9px] text-green-600 font-bold block mt-1">Included in Unlimited</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. PREMIUM RIDERS (UPDATED TO TEAL THEME) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xl">🚀</span> 
              Premium Riders & Boosters
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riders.map((rider) => {
                const isTenureDisabled = rider.minTenure && tenure < rider.minTenure; 
                const isBaseDisabled = rider.isDisabledByBase; 
                const isDisabled = isTenureDisabled || isBaseDisabled;
                
                let displayDesc = rider.desc;
                if(rider.id === 'flexi_year' && tenure > 1) {
                    displayDesc = `Use ${tenure}x coverage amount in 1st Year`;
                }

                return (
                  <div 
                    key={rider.id}
                    onClick={() => !isDisabled && toggleRider(rider.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-stretch gap-2 ${
                      isDisabled ? 'opacity-60 bg-gray-50 border-gray-100 cursor-not-allowed' :
                      rider.active ? 'border-teal-500 bg-teal-50 cursor-pointer' : 'border-gray-200 hover:border-teal-200 hover:bg-teal-50/30 cursor-pointer'
                    }`}
                  >
                    {/* Main Row */}
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${
                          rider.active ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {rider.icon}
                        </div>

                        <div className="flex-1">
                          <h3 className={`font-bold ${rider.active ? 'text-teal-700' : 'text-slate-700'}`}>{rider.label}</h3>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{displayDesc}</p>
                          
                          {isBaseDisabled && (
                              <span className="text-[10px] font-bold text-green-600 mt-1 block">Not needed for Unlimited Plan</span>
                          )}
                          {isTenureDisabled && !isBaseDisabled && (
                              <span className="text-[10px] font-bold text-red-500 mt-1 block">Requires {rider.minTenure}+ Year Tenure</span>
                          )}

                          {!isDisabled && (
                              <p className={`text-xs font-bold mt-2 ${rider.active ? 'text-teal-600' : 'text-gray-400'}`}>
                                {rider.active ? 'Added (+₹' + rider.price.toLocaleString() + ')' : '+ ₹' + rider.price.toLocaleString()}
                              </p>
                          )}
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          rider.active ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300'
                        }`}>
                          {rider.active && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                    </div>

                    {/* Chronic Care Multi-Select (Chips) - Teal Theme */}
                    {rider.isMultiSelect && rider.active && (
                       <div className="mt-3 pt-3 border-t border-teal-200 animate-in fade-in zoom-in duration-300">
                          <label className="text-[10px] font-bold text-teal-600 uppercase mb-2 block flex justify-between">
                              <span>Select Conditions ({rider.selectedConditions.length})</span>
                              <span>Price increases with count</span>
                          </label>
                          <div className="flex flex-wrap gap-2">
                             {chronicDiseases.map(disease => {
                                 const isSelected = rider.selectedConditions.includes(disease);
                                 return (
                                     <button
                                        key={disease}
                                        onClick={(e) => toggleChronicCondition(disease, e)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                                            isSelected 
                                            ? 'bg-teal-600 text-white border-teal-600 shadow-sm' 
                                            : 'bg-white text-slate-600 border-gray-300 hover:border-teal-400'
                                        }`}
                                     >
                                         {disease} {isSelected && '✓'}
                                     </button>
                                 )
                             })}
                          </div>
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* --- RIGHT COLUMN: SUMMARY --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Plan Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sum Insured</span>
                <span className="font-bold text-[#1A5EDB] text-lg">{sumInsuredSteps[sliderIndex].label}</span>
              </div>
              
              {riders.some(r => r.active) && (
                  <div className="pt-2 border-t border-dashed border-gray-200">
                      <span className="text-xs font-bold text-gray-400 uppercase">Active Riders</span>
                      <div className="flex flex-col gap-2 mt-2">
                          {riders.filter(r => r.active).map(r => (
                              <div key={r.id} className="flex flex-col text-[11px] bg-teal-50 p-2 rounded gap-1">
                                 <div className="flex justify-between items-center">
                                    <span className="font-bold text-teal-700">{r.label}</span>
                                    <span className="text-teal-700 font-bold">+₹{r.price.toLocaleString()}</span>
                                 </div>
                                 {r.isMultiSelect && (
                                     <div className="text-[9px] text-teal-600 flex flex-wrap gap-1">
                                         {r.selectedConditions.map(c => <span key={c} className="bg-teal-100 px-1 rounded">{c}</span>)}
                                     </div>
                                 )}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <div className="border-t border-dashed border-gray-200 my-2"></div>
              
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-500 font-medium">Policy Tenure</span>
                <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                  {[1, 2, 3].map(t => (
                    <button key={t} onClick={() => setTenure(t)} className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-xs transition-all ${tenure === t ? 'bg-white shadow-sm text-[#1A5EDB]' : 'text-gray-400'}`}>{t}Y</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-end">
                <div>
                   <span className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Total Premium</span>
                   <span className="text-3xl font-bold text-[#1A5EDB]">₹{calculatePremium()}</span>
                </div>
                <div className="text-right">
                    <span className="text-sm font-bold text-blue-400 mb-1 block">/ year</span>
                    {tenure > 1 && <span className="text-[10px] text-green-600 font-bold bg-green-100 px-1.5 py-0.5 rounded">Saved {tenure === 2 ? '10%' : '15%'}</span>}
                </div>
              </div>
            </div>

            <button onClick={() => alert("Proceeding to payment...")} className="w-full py-4 bg-[#1A5EDB] text-white font-bold rounded-xl shadow-lg hover:bg-[#1149AE]">
              Buy Now &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomizeHealthPage;