import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  VAJRA_FEATURE_COSTS_BASE,
  VAJRA_RIDER_COSTS_BASE,
  VAJRA_CHRONIC_COSTS_BASE,
  VAJRA_AGE_MULTIPLIERS,
  getVajraCoverageKey,
  getVajraFeatureCost,
  getVajraRiderCost,
  getVajraChronicCost,
  VAJRA_FEATURE_LABELS,
  VAJRA_RIDER_LABELS
} from '../../../../utils/vajraPremiumCalculator';

const CustomizeHealthPage = ({ initialData, onProceed, onChange }) => {
  const sumInsuredSteps = [
    { label: "10L", value: 1000000 },
    { label: "15L", value: 1500000 },
    { label: "20L", value: 2000000 },
    { label: "30L", value: 3000000 },
    { label: "50L", value: 5000000 },
    { label: "1Cr", value: 10000000 },
    { label: "1.5Cr", value: 15000000 },
    { label: "2Cr", value: 20000000 },
    { label: "3Cr", value: 30000000 },
    { label: "5Cr", value: 50000000 },
    { label: "Unlimited", value: 999999999 }
  ];

  const chronicDiseases = ["Diabetes", "High Cholesterol", "COPD", "Heart Disease", "Hypertension", "Asthma"];

  const defaultFeatures = [
    { id: 'global', label: 'Global Coverage', icon: '🌍', active: true },
    { id: 'claim_100', label: '100% Claim Coverage', icon: '💯', active: true, isLocked: true },
     { id: 'AnyRoom', label: 'Any Room', icon: '🛏️', active: true, isLocked: true },
    { id: 'maternity_global', label: 'Maternity Cover', icon: '🤰', active: true },
    { id: 'non_deduct', label: 'Non-Deductible Items', icon: '📄', active: true },
    { id: 'health_check', label: 'Free Health Checkup', icon: '🩺', active: true },
    { id: 'NCB', label: 'No Claim Bonus (10%)', icon: '📈', active: true },
    { id: 'restore', label: 'Auto Restore Benefit', icon: '🔄', active: true },
     { id: 'ambulance', label: 'Ambulance Charges', icon: '🚑', active: true },
    { id: 'air_amb', label: 'Emergency Air Ambulance', icon: '🚁', active: false },
    { id: 'hosp_mandatory', label: 'Hospitalisation Cover', icon: '🏥', active: true, isLocked: true },
    { id: 'day_care', label: 'Day Care Procedures', icon: '💊', active: true },
    { id: 'ayush', label: 'AYUSH Benefits', icon: '🌿', active: true },
    { id: 'organ', label: 'Organ Donor Expenses', icon: '🤝', active: false },
    { id: 'domiciliary', label: 'Domiciliary Expenses', icon: '🏠', active: true },
    { id: 'no_sublimit', label: 'No Sublimits', icon: '🔓', active: true, isLocked: true },
  ];

  // Merged riders: smart_agg and ped_wait support variant selection
  const defaultRiders = [
    { id: 'unlimited_care', label: 'Unlimited Care', desc: 'Once in a lifetime benefit cover.', icon: '♾️', active: false },
    { id: 'inflation_shield', label: 'Inflation Shield', desc: 'SI increases annually matching inflation.', icon: '📈', active: false },
    { id: 'tele_consult', label: 'Tele-Consultation', desc: 'Unlimited online doctor consults 24/7', icon: '📱', active: false },
    { id: 'smart_agg', label: 'Smart Aggregate', desc: 'Aggregate benefit (choose 2Y or 3Y)', icon: '🔁', active: false, selectedVariant: '3y' },
    { id: 'super_bonus', label: 'Super Bonus (7x)', desc: 'Additional sum insured on claim-free years', icon: '🚀', active: false },
    { id: 'ped_wait', label: 'PED Wait Reduction', desc: 'Reduce PED waiting period (choose reduction)', icon: '⏳', active: false, selectedVariant: '1y' },
    { id: 'specific_wait', label: 'Specific Disease Wait', desc: 'Reduce waiting period for specific illnesses', icon: '⚕️', active: false },
    { id: 'maternity_boost', label: 'Maternity Booster', desc: 'Up to 10% (max ₹5,00,000), min 2 year waiting', icon: '🤰', active: false, waitOption: 2 },
  ];

  const getInitialSliderIndex = () => {
    if (initialData?.currentSI?.value) {
      const idx = sumInsuredSteps.findIndex(s => s.value === initialData.currentSI.value);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  };

  const [sliderIndex, setSliderIndex] = useState(getInitialSliderIndex);
  const [tenure, setTenure] = useState(initialData?.tenure || 1);
  const [preHosp, setPreHosp] = useState(initialData?.preHosp || 60);
  const [postHosp, setPostHosp] = useState(initialData?.postHosp || 90);
  
  const [chronicActive, setChronicActive] = useState(
    (initialData?.selectedChronic && initialData.selectedChronic.length > 0) || false
  );
  const [selectedChronic, setSelectedChronic] = useState(
    (initialData?.selectedChronic && initialData.selectedChronic.length > 0) 
    ? initialData.selectedChronic 
    : ['Diabetes']
  );

  const [features, setFeatures] = useState(initialData?.features || defaultFeatures);
  const [riders, setRiders] = useState(initialData?.riders || defaultRiders);

  const currentSI = sumInsuredSteps[sliderIndex];
  const isBaseUnlimited = currentSI.value === 999999999;
  const isMaternityActive = features.find(f => f.id === 'maternity_global')?.active;

  // Get member ages from initialData for premium calculations
  const memberAges = initialData?.memberAges || {};
  const allAges = Object.values(memberAges).flat().filter(a => a);
  const eldestAge = allAges.length > 0 ? Math.max(...allAges.map(a => parseFloat(a) || 0)) : 30;
  const coverageKey = getVajraCoverageKey(currentSI);

  // Auto-enable/disable smart_agg rider based on tenure using useMemo
  // This avoids the cascading render issue from setState in useEffect
const processedRiders = useMemo(() => {
  // Ensure riders is always an array
  if (!Array.isArray(riders)) return [];

  return riders.map(r => {
    // Disable smart_agg if tenure is 1
    if (String(r.id || '').toLowerCase() === 'smart_agg') {
      return { ...r, active: tenure > 1 ? r.active : false };
    }
    return r;
  });
}, [riders, tenure]);

// Ensure smart_agg variant respects tenure changes (coerce/deselect invalid options)
useEffect(() => {
  setRiders(prev => {
    const source = Array.isArray(prev) ? prev : (Array.isArray(initialData?.riders) ? initialData.riders : defaultRiders);
    return source.map(r => {
      if (r.id !== 'smart_agg') return r;
      // Disable entirely on tenure 1
      if (tenure === 1) return { ...r, active: false, selectedVariant: r.selectedVariant === '3y' ? '2y' : r.selectedVariant };
      // If tenure is 2 and variant was 3y, coerce to 2y
      if (tenure === 2 && r.selectedVariant === '3y') return { ...r, selectedVariant: '2y' };
      return r;
    });
  });
}, [tenure]);

// PED reduction listbox options and presentational state
const PED_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: '2y', label: '3y → 2y' },
  { value: '1y', label: '3y → 1y' }
];
const [pedOpen, setPedOpen] = useState(false);
const [pedFocusIndex, setPedFocusIndex] = useState(-1);
const pedRef = useRef(null);

// Close PED listbox on outside click
useEffect(() => {
  const onDocClick = (e) => {
    if (pedRef.current && !pedRef.current.contains(e.target)) {
      setPedOpen(false);
      setPedFocusIndex(-1);
    }
  };
  document.addEventListener('mousedown', onDocClick);
  return () => document.removeEventListener('mousedown', onDocClick);
}, []);

// Keyboard navigation for PED listbox
const handlePedKeyDown = (e) => {
  const opts = PED_OPTIONS;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setPedOpen(true);
    setPedFocusIndex((i) => Math.min(i + 1, opts.length - 1));
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setPedOpen(true);
    setPedFocusIndex((i) => Math.max(i - 1, 0));
  } else if (e.key === 'Enter' || e.key === ' ') {
    if (pedOpen && pedFocusIndex >= 0) {
      const val = opts[pedFocusIndex].value;
      setRiders(prev => {
        const src = Array.isArray(prev) ? prev : (Array.isArray(initialData?.riders) ? initialData.riders : defaultRiders);
        return src.map(x => x.id === 'ped_wait' ? { ...x, selectedVariant: val, active: val !== 'none' } : x);
      });
      setPedOpen(false);
      setPedFocusIndex(-1);
    } else {
      setPedOpen((o) => !o);
    }
    e.preventDefault();
  } else if (e.key === 'Escape') {
    setPedOpen(false);
    setPedFocusIndex(-1);
  }
};


  // Calculate estimated premium using VAJRA pricing model
  const estimatedPremium = useMemo(() => {
    let total = 0;
    
    // Base hospitalisation per member
    const baseCost = allAges.length > 0
      ? allAges.reduce((sum, age) => sum + getVajraFeatureCost('hosp_mandatory', coverageKey, age), 0)
      : getVajraFeatureCost('hosp_mandatory', coverageKey, eldestAge);
    total += baseCost;
    
    // Pre-hospitalization cost
    const preHospKey = `pre_hosp_${preHosp}`;
    total += getVajraFeatureCost(preHospKey, coverageKey, eldestAge);
    
    // Post-hospitalization cost
    const postHospKey = `post_hosp_${postHosp}`;
    total += getVajraFeatureCost(postHospKey, coverageKey, eldestAge);
    
    // Active features cost
    features.forEach(f => {
      if (f.active && f.id !== 'hosp_mandatory' && !f.id.startsWith('pre_hosp') && !f.id.startsWith('post_hosp')) {
        total += getVajraFeatureCost(f.id, coverageKey, eldestAge);
      }
    });
    
    // Active riders cost (use processedRiders for correct smart_agg and PED handling)
    processedRiders.forEach(r => {
      if (!r.active) return;

      // Determine effective rider id for pricing (handle variants)
      let effectiveRiderId = r.id;

      // Smart aggregate pricing depends on tenure (handled by getVajraRiderCost too,
      // but we keep explicit mapping for clarity)
      if (r.id === 'smart_agg') {
        effectiveRiderId = tenure === 2 ? 'smart_agg_2y' : 'smart_agg_3y';
      }

      // PED wait reduction uses selectedVariant on the rider ('2y' or '1y')
      if (r.id === 'ped_wait') {
        const v = r.selectedVariant || '1y';
        effectiveRiderId = `ped_wait_${v.replace(/[^0-9a-z]/gi, '')}`; // e.g. ped_wait_2y
      }

      total += getVajraRiderCost(effectiveRiderId, coverageKey, eldestAge, tenure);
    });
    
    // Chronic conditions cost
    if (chronicActive && selectedChronic.length > 0) {
      selectedChronic.forEach(cond => {
        total += getVajraChronicCost(cond, coverageKey, eldestAge);
      });
    }
    
    // Apply tenure discount
    if (tenure === 2) total *= 0.95;
    if (tenure === 3) total *= 0.90;
    
    return Math.round(total);
  }, [tenure, preHosp, postHosp, features, processedRiders, chronicActive, selectedChronic, allAges, coverageKey, eldestAge]);

  // Notify parent of changes for live PaymentSummary update
  useEffect(() => {
    if (onChange) {
      onChange({
        currentSI,
        tenure,
        preHosp,
        postHosp,
        features,
        riders: {
          features: features.filter(f => f.active),
          selectedRiders: processedRiders.filter(r => r.active),
          addons: processedRiders.filter(r => r.active),
          chronicConditions: chronicActive ? selectedChronic : []
        },
        selectedChronic: chronicActive ? selectedChronic : [],
        estimatedPremium
      });
    }
  }, [onChange, currentSI, tenure, preHosp, postHosp, features, processedRiders, chronicActive, selectedChronic, estimatedPremium]);

  const handleProceed = () => {
    const customConfig = {
      ...(initialData || {}),
      currentSI,
      tenure,
      preHosp,
      postHosp,
      features,
      riders: {
        features: features.filter(f => f.active),
        selectedRiders: processedRiders.filter(r => r.active),
        addons: processedRiders.filter(r => r.active),
        chronicConditions: chronicActive ? selectedChronic : []
      },
      selectedChronic: chronicActive ? selectedChronic : []
    };
    
    if (onProceed) {
      onProceed(customConfig);
    }
  };

  const toggleFeature = (id) => setFeatures(prev => prev.map(f => {
    if (f.id === id) {
      if (f.isLocked) return f;
      return { ...f, active: !f.active };
    }
    return f;
  }));

  const toggleRider = (id) => {
    // Prevent enabling unlimited on unlimited base
    if (id === 'unlimited_care' && isBaseUnlimited) return;

    setRiders(prev => prev.map(r => {
      // Mutual exclusivity: Smart Aggregate options
      if (String(id).toLowerCase().startsWith('smart_agg') && String(r.id).toLowerCase().startsWith('smart_agg')) {
        // If clicking same id, toggle; otherwise turn off the other variant
        if (r.id === id) return { ...r, active: !r.active };
        return { ...r, active: false };
      }

      // Mutual exclusivity: PED wait options
      if (String(id).toLowerCase().startsWith('ped_wait') && String(r.id).toLowerCase().startsWith('ped_wait')) {
        if (r.id === id) return { ...r, active: !r.active };
        return { ...r, active: false };
      }

      return r.id === id ? { ...r, active: !r.active } : r;
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-8 bg-gray-50 min-h-screen font-sans">
      
      <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-2xl border-b-4 border-blue-500 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black italic tracking-tighter mb-1">VAJRA SURAKSHA BUILDER</h1>
          <p className="text-blue-200 text-sm font-bold uppercase tracking-wide">Configure Your Ultimate Health Shield</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
        
        <div className="lg:col-span-8 space-y-8">
          
          <section className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-slate-800 uppercase tracking-wide text-sm flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">💰</span> Sum Insured
              </h2>
              <span className="text-3xl font-black text-blue-600 tracking-tight">₹{currentSI.label}</span>
            </div>
            
            <div className="relative px-2">
              <input 
                type="range" 
                min="0" 
                max={sumInsuredSteps.length - 1} 
                step="1" 
                value={sliderIndex} 
                onChange={(e) => setSliderIndex(Number(e.target.value))} 
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              />
              <div className="flex justify-between mt-4">
                 {sumInsuredSteps.filter((_, i) => i % 2 === 0).map((s, i) => (
                   <span key={i} className="text-[10px] font-bold text-gray-400 uppercase">{s.label}</span>
                 ))}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="font-bold text-slate-800 uppercase tracking-wide text-sm mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">🏥</span> Hospitalisation Duration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Pre-Hospitalisation</p>
                <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  {[30, 60, 90].map(d => (
                    <button key={d} onClick={() => setPreHosp(d)} className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${preHosp === d ? 'bg-white text-blue-700 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}>
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Post-Hospitalisation</p>
                <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  {[60, 90, 180].map(d => (
                    <button key={d} onClick={() => setPostHosp(d)} className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${postHosp === d ? 'bg-white text-blue-700 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}>
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="font-bold text-slate-800 uppercase tracking-wide text-sm mb-6 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">✨</span> Base Features
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {features.map(f => (
                <button 
                  key={f.id} 
                  onClick={() => toggleFeature(f.id)} 
                  disabled={f.isLocked}
                  className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-200 group flex flex-col items-center justify-center min-h-[120px] ${
                    f.active 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  } ${f.isLocked ? 'cursor-default opacity-80' : 'cursor-pointer active:scale-95'}`}
                >
                  {f.isLocked && <span className="absolute top-2 right-2 text-[10px] opacity-50">🔒</span>}
                  <span className={`text-3xl mb-3 transition-transform duration-300 ${f.active ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>{f.icon}</span>
                  <span className={`text-[11px] font-bold uppercase leading-tight ${f.active ? 'text-blue-900' : 'text-gray-500'}`}>{f.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-orange-50/50 p-6 rounded-3xl shadow-lg border border-orange-100">
             <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">💊</div>
                  <div>
                    <h2 className="font-bold text-orange-900 uppercase text-sm">Chronic Care</h2>
                    <p className="text-[10px] text-orange-700 font-bold uppercase tracking-wide">Conditions covered from Day 31</p>
                  </div>
                </div>
                <button 
                  onClick={() => setChronicActive(!chronicActive)} 
                  className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wide transition-all ${chronicActive ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-orange-600 border border-orange-200 hover:bg-orange-50'}`}
                >
                  {chronicActive ? 'Active' : 'Add Cover'}
                </button>
             </div>
             
             <div className={`transition-all duration-500 ease-in-out overflow-hidden ${chronicActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                    {chronicDiseases.map(d => (
                        <button 
                          key={d} 
                          onClick={() => setSelectedChronic(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} 
                          className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all ${selectedChronic.includes(d) ? 'border-orange-500 bg-orange-500 text-white shadow-md' : 'border-orange-200 bg-white text-orange-800 hover:bg-orange-100'}`}
                        >
                          {d}
                        </button>
                    ))}
                 </div>
             </div>
          </section>

          <section className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="font-bold text-slate-800 uppercase tracking-wide text-sm mb-6 flex items-center gap-2">
              <span className="bg-teal-100 text-teal-700 p-1.5 rounded-lg">🚀</span> Premium Riders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedRiders.map(r => {
                    if (r.id === 'maternity_boost' && !isMaternityActive) return null;
                    const isDisabled = (r.id === 'unlimited_care' && isBaseUnlimited) || (r.id === 'smart_agg' && (tenure === 1 || isBaseUnlimited)) || (r.id === 'inflation_shield' && isBaseUnlimited);

                    // Special merged UI for Smart Aggregate
                    if (r.id === 'smart_agg') {
                      return (
                        <div key={r.id} className={`flex items-center p-4 rounded-2xl border transition-all text-left ${isDisabled ? 'opacity-40 grayscale border-gray-100' : r.active ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200 bg-white'}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 ${r.active ? 'bg-teal-100' : 'bg-gray-50'}`}>{r.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className={`font-bold text-xs uppercase tracking-wide mb-1 ${r.active ? 'text-teal-900' : 'text-gray-700'}`}>{r.label}</h3>
                                <p className="text-[10px] text-gray-500 leading-tight font-medium">{r.desc}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => toggleRider('smart_agg')} disabled={isDisabled} className={`px-3 py-1 rounded-full text-xs font-bold ${r.active ? 'bg-teal-600 text-white' : 'bg-white border'}`}>{r.active ? 'Enabled' : 'Add'}</button>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button onClick={() => setRiders(prev => {
                                  const src = Array.isArray(prev) ? prev : (Array.isArray(initialData?.riders) ? initialData.riders : defaultRiders);
                                  return src.map(x => x.id === 'smart_agg' ? { ...x, selectedVariant: '2y', active: true } : x);
                                })} disabled={isDisabled || !r.active} className={`px-2 py-1 rounded-md text-xs ${r.selectedVariant === '2y' ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}>2 Year</button>
                              <button onClick={() => setRiders(prev => {
                                  const src = Array.isArray(prev) ? prev : (Array.isArray(initialData?.riders) ? initialData.riders : defaultRiders);
                                  return src.map(x => x.id === 'smart_agg' ? { ...x, selectedVariant: '3y', active: true } : x);
                                })} disabled={isDisabled || !r.active || tenure === 2} className={`px-2 py-1 rounded-md text-xs ${r.selectedVariant === '3y' ? 'bg-blue-600 text-white' : 'bg-gray-50'} ${tenure === 2 ? 'opacity-50 cursor-not-allowed' : ''}`}>3 Year</button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Special merged UI for PED Wait Reduction
                    if (r.id === 'ped_wait') {
                      return (
                        <div key={r.id} className={`flex items-center p-4 rounded-2xl border transition-all text-left ${isDisabled ? 'opacity-40 grayscale border-gray-100' : r.active ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200 bg-white'}`}>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 ${r.active ? 'bg-teal-100' : 'bg-gray-50'}`}>{r.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className={`font-bold text-xs uppercase tracking-wide mb-1 ${r.active ? 'text-teal-900' : 'text-gray-700'}`}>{r.label}</h3>
                                <p className="text-[10px] text-gray-500 leading-tight font-medium">{r.desc}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => toggleRider('ped_wait')} disabled={isDisabled} className={`px-3 py-1 rounded-full text-xs font-bold ${r.active ? 'bg-teal-600 text-white' : 'bg-white border'}`}>{r.active ? 'Enabled' : 'Add'}</button>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2 items-center">
                              <label className="text-[10px] text-gray-500">Reduction:</label>
                              <div className="relative" ref={pedRef} onKeyDown={handlePedKeyDown}>
                                <button
                                  type="button"
                                  aria-haspopup="listbox"
                                  aria-expanded={pedOpen}
                                  onClick={() => { setPedOpen(o => !o); setPedFocusIndex(-1); }}
                                  disabled={isDisabled || !r.active}
                                  className={`w-40 text-left pl-3 pr-8 py-2 rounded-md text-sm font-semibold transition duration-150 ${(!r.active || isDisabled) ? 'bg-gray-50 text-gray-400 border border-gray-100' : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                  <span className="flex items-center justify-between">
                                    <span className="truncate">
                                      {r.selectedVariant && r.selectedVariant !== 'none' ? PED_OPTIONS.find(o => o.value === r.selectedVariant)?.label : 'None'}
                                    </span>
                                    <svg className={`w-4 h-4 ml-2 transition-transform duration-150 ${pedOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                  </span>
                                </button>

                                <div
                                  role="listbox"
                                  aria-label="PED reduction options"
                                  tabIndex={-1}
                                  className={`absolute z-40 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 ring-1 ring-black/5 py-1 max-h-44 overflow-auto focus:outline-none transition-all duration-150 transform origin-top-right ${pedOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}
                                >
                                  {PED_OPTIONS.map((opt, idx) => {
                                    const isSelected = opt.value === (r.selectedVariant || 'none');
                                    const isFocused = idx === pedFocusIndex;
                                    return (
                                      <div
                                        key={opt.value}
                                        role="option"
                                        aria-selected={isSelected}
                                        onMouseEnter={() => setPedFocusIndex(idx)}
                                        onMouseLeave={() => setPedFocusIndex(-1)}
                                        onClick={() => { setRiders(prev => {
                                            const src = Array.isArray(prev) ? prev : (Array.isArray(initialData?.riders) ? initialData.riders : defaultRiders);
                                            return src.map(x => x.id === 'ped_wait' ? { ...x, selectedVariant: opt.value, active: opt.value !== 'none' } : x);
                                          }); setPedOpen(false); setPedFocusIndex(-1); }}
                                        className={`flex items-center justify-between cursor-pointer px-3 py-2 text-sm transition-colors duration-150 ${isSelected ? 'bg-teal-50 text-teal-900 font-semibold' : 'text-gray-800 hover:bg-gray-50'} ${isFocused ? 'bg-gray-50' : ''}`}
                                      >
                                        <span className="truncate">{opt.label}</span>
                                        {isSelected && (
                                          <svg className="w-4 h-4 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                          </svg>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Default rendering for other riders
                    return (
                      <button 
                        key={r.id} 
                        disabled={isDisabled} 
                        onClick={() => toggleRider(r.id)} 
                        className={`flex items-center p-4 rounded-2xl border transition-all text-left group ${
                          isDisabled ? 'opacity-40 grayscale cursor-not-allowed border-gray-100' : 
                          r.active ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 
                          'border-gray-200 bg-white hover:border-teal-300 hover:shadow-sm'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 transition-colors ${r.active ? 'bg-teal-100' : 'bg-gray-50 group-hover:bg-teal-50'}`}>
                          {r.icon}
                        </div>
                        <div>
                          <h3 className={`font-bold text-xs uppercase tracking-wide mb-1 ${r.active ? 'text-teal-900' : 'text-gray-700'}`}>{r.label}</h3>
                          <p className="text-[10px] text-gray-500 leading-tight font-medium">{r.desc}</p>
                        </div>
                        <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${r.active ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                          {r.active && <span className="text-white text-[10px]">✓</span>}
                        </div>
                      </button>
                    );
                  })}
            </div>
          </section>

        </div>

        <aside className="lg:col-span-4 h-fit lg:sticky lg:top-6 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
            
            <h2 className="font-black text-slate-800 uppercase text-lg mb-6 flex items-center gap-2">
              📝 Plan Summary
            </h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-1.5 rounded-xl flex">
                 {[1, 2, 3].map((y) => (
                   <button 
                    key={y} 
                    onClick={() => setTenure(y)} 
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tenure === y ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                     {y} Yr{y > 1 ? 's' : ''}
                   </button>
                 ))}
              </div>

              <div className="space-y-3 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Sum Insured</span>
                  <span className="text-blue-700 font-black">₹{currentSI.label}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Pre/Post Hosp</span>
                  <span className="text-slate-800 font-bold">{preHosp}/{postHosp} Days</span>
                </div>
              </div>

              {chronicActive && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">Chronic Care</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChronic.map(cond => (
                      <span key={cond} className="text-[9px] font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded-md border border-orange-100">
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Active Features</h3>
                <div className="max-h-32 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
                  {features.filter(f => f.active).map(f => (
                    <div key={f.id} className="flex items-center gap-2 text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span>{f.icon}</span>
                      <span className="font-semibold">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {processedRiders.some(r => r.active) && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Riders</h3>
                  <div className="space-y-1.5">
                    {processedRiders.filter(r => r.active).map(r => (
                      <div key={r.id} className="flex items-center gap-2 text-[11px] text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-100">
                        <span>{r.icon}</span>
                        <span className="font-semibold">{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estimated Premium Display */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Estimated Premium</span>
                  {tenure > 1 && (
                    <span className="text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      {tenure === 2 ? '5%' : '10%'} OFF
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-blue-700">₹{estimatedPremium.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-gray-500 font-medium">/year</span>
                </div>
                <p className="text-[9px] text-gray-400 mt-1">*Excl. GST • Final premium in checkout</p>
              </div>
            </div>

            <button 
              onClick={handleProceed} 
              className="mt-8 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="uppercase tracking-wider text-xs">Confirm Configuration</span>
            </button>
          </div>
        </aside>

      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}</style>
    </div>
  );
};

export default CustomizeHealthPage;