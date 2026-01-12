import React, { useState, useEffect } from 'react';

// --- INTERNAL ICONS (No Install Required) ---
const ChevronRight = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"/></svg>
);
const Check = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
);
const Shield = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const Info = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);
const Heart = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
const Zap = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const Activity = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
);
const Plane = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
);
const Stethoscope = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.8 2.3A.3.3 0 1 0 5.2 2l-.4.3z"/><path d="M19.2 2.3a.3.3 0 1 1 .4-.3l-.4.3z"/><path d="M11 17a6 6 0 0 1-6-6V2"/><path d="M20 2v6a6 6 0 0 1-6 6"/><circle cx="12" cy="19" r="2"/></svg>
);

// --- UI COMPONENTS ---

// 1. Custom Toggle Switch
const Toggle = ({ label, checked, onChange, info }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="pr-4">
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{label}</span>
        {info && <Info size={14} className="text-gray-400 cursor-help" />}
      </div>
      {checked && <p className="text-xs text-[#1A5EDB] mt-1 font-medium">Active</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1A5EDB] focus:ring-offset-2 ${
        checked ? 'bg-[#1A5EDB]' : 'bg-gray-200'
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

// 2. Plan Selection Card (Top Section)
const PlanReferenceCard = ({ plan, isSelected, onSelect }) => (
  <div 
    onClick={onSelect}
    className={`relative cursor-pointer group rounded-2xl p-5 border-2 transition-all duration-300 ${
      isSelected 
        ? 'border-[#1A5EDB] bg-[#1A5EDB]/5 shadow-lg shadow-blue-100' 
        : 'border-transparent bg-white shadow-md hover:-translate-y-1 hover:shadow-xl'
    }`}
  >
    {plan.badge && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A5EDB] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
        {plan.badge}
      </span>
    )}
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-full ${isSelected ? 'bg-white text-[#1A5EDB]' : 'bg-blue-50 text-blue-500'}`}>
        {plan.icon}
      </div>
      {isSelected && <div className="bg-[#1A5EDB] text-white p-1 rounded-full"><Check size={12} /></div>}
    </div>
    <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
    <p className="text-sm text-gray-500 mb-4">{plan.desc}</p>
    <div className="text-2xl font-bold text-[#1A5EDB] mb-4">₹{plan.cover}</div>
    <ul className="space-y-2 mb-4">
      {plan.features.map((f, i) => (
        <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-gray-300"></div> {f}
        </li>
      ))}
    </ul>
  </div>
);

// --- MAIN PAGE COMPONENT ---

const CustomizeHealthPage = () => {
  // --- STATE ---
  const [selectedPlanId, setSelectedPlanId] = useState(2); // Default to Family Shield
  const [sumInsured, setSumInsured] = useState(10); // in Lakhs
  const [roomType, setRoomType] = useState('single');
  const [premium, setPremium] = useState(12400);

  // Toggles State
  const [features, setFeatures] = useState({
    copay: false,
    diseaseLimits: true,
    restoration: true,
    dayCare: true,
    domiciliary: false,
    ncb: true,
    checkups: true,
    ayush: false,
    maternity: true,
    opd: false,
    ambulance: true,
  });

  // Riders State
  const [riders, setRiders] = useState({
    unlimited: false,
    superNcb: false,
    inflation: false,
    accidental: false,
    returnPremium: false
  });

  // --- MOCK DATA ---
  const plans = [
    { id: 1, name: "Basic Care", cover: "5L", desc: "Essential coverage for individuals", icon: <Shield size={20}/>, features: ["Single Private Room", "COVID-19 Cover"] },
    { id: 2, name: "Family Shield", cover: "10L", badge: "Best Seller", desc: "Complete family protection", icon: <Heart size={20}/>, features: ["Maternity Benefit", "Newborn Cover"] },
    { id: 3, name: "Senior Protect", cover: "15L", desc: "Specialized for ages 60+", icon: <Activity size={20}/>, features: ["OPD Cover", "Reduced Waiting"] },
    { id: 4, name: "Universal", cover: "1Cr", desc: "Premium global coverage", icon: <Plane size={20}/>, features: ["Global Cover", "Air Ambulance"] },
  ];

  const sumOptions = [3, 5, 10, 25, 50, 100];

  // --- CALCULATOR LOGIC ---
  useEffect(() => {
    // A simplified premium calculation for demo purposes
    let base = 8000;
    
    // Sum Insured Multiplier
    base += sumInsured * 200;

    // Room Type Cost
    if (roomType === 'single') base += 1500;
    if (roomType === 'any') base += 4000;

    // Feature Costs
    if (features.maternity) base += 3500;
    if (features.opd) base += 2000;
    if (features.ayush) base += 500;
    if (!features.copay) base += 1000; 

    // Rider Costs
    if (riders.unlimited) base += 1200;
    if (riders.superNcb) base += 800;
    if (riders.accidental) base += 600;

    setPremium(base);
  }, [sumInsured, roomType, features, riders]);

  const toggleFeature = (key) => setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleRider = (key) => setRiders(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 pb-20">
      
      {/* 1. HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center text-sm text-gray-400 mb-1">
            <span>Dashboard</span> <ChevronRight size={14} className="mx-1"/>
            <span>Plans</span> <ChevronRight size={14} className="mx-1"/>
            <span className="text-[#1A5EDB] font-medium">Customize Plan</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customize Your Health Insurance</h1>
              <p className="text-gray-500 text-sm mt-1">Build a plan that fits your health needs and budget.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        
        {/* 2. PRE-EXISTING PLANS (TOP ROW) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <PlanReferenceCard 
              key={plan.id} 
              plan={plan} 
              isSelected={selectedPlanId === plan.id}
              onSelect={() => {
                setSelectedPlanId(plan.id);
                if(plan.id === 4) setSumInsured(50);
                else setSumInsured(10);
              }}
            />
          ))}
        </section>

        {/* 3. MAIN CUSTOMIZATION AREA */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: CONTROLS (8 COLS) */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* A. CORE COVERAGE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="text-[#1A5EDB]" size={20} /> Core Coverage
              </h2>

              {/* Sum Insured Slider */}
              <div className="mb-10">
                <div className="flex justify-between mb-4">
                  <label className="font-semibold text-gray-700">Sum Insured</label>
                  <span className="text-2xl font-bold text-[#1A5EDB]">₹{sumInsured} Lakhs</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="5" 
                  step="1"
                  value={sumOptions.indexOf(sumInsured)}
                  onChange={(e) => setSumInsured(sumOptions[e.target.value])}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#1A5EDB]"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                  {sumOptions.map((opt) => (
                    <span key={opt}>₹{opt}L</span>
                  ))}
                </div>
              </div>

              {/* Room Rent Options */}
              <div className="mb-8">
                <label className="font-semibold text-gray-700 mb-3 block">Room Rent Limit</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'capped', label: '₹5,000 / Day', desc: 'Standard Limit' },
                    { id: 'single', label: 'Single Private', desc: 'Most Popular' },
                    { id: 'any', label: 'Any Room', desc: 'Suites included' }
                  ].map((opt) => (
                    <div 
                      key={opt.id}
                      onClick={() => setRoomType(opt.id)}
                      className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                        roomType === opt.id 
                          ? 'border-[#1A5EDB] bg-[#1A5EDB]/5' 
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-900">{opt.label}</span>
                        {roomType === opt.id && <div className="w-4 h-4 rounded-full bg-[#1A5EDB] border-2 border-white shadow-sm" />}
                      </div>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Basic Toggles */}
              <div className="space-y-1">
                <Toggle 
                  label="Co-Payment (10%)" 
                  info="You pay 10% of the claim amount."
                  checked={features.copay} 
                  onChange={() => toggleFeature('copay')} 
                />
                <Toggle 
                  label="Restoration Benefit" 
                  info="Refill sum insured after claim."
                  checked={features.restoration} 
                  onChange={() => toggleFeature('restoration')} 
                />
              </div>
            </div>

            {/* B. HOSPITALIZATION & TREATMENTS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
               <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Stethoscope className="text-[#1A5EDB]" size={20} /> Hospitalization & Care
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <Toggle label="Day-care Treatments" checked={features.dayCare} onChange={() => toggleFeature('dayCare')} />
                <Toggle label="Domiciliary (Home) Care" checked={features.domiciliary} onChange={() => toggleFeature('domiciliary')} />
                <Toggle label="AYUSH Treatments" checked={features.ayush} onChange={() => toggleFeature('ayush')} />
                <Toggle label="Ambulance Cover" checked={features.ambulance} onChange={() => toggleFeature('ambulance')} />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                 <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Premium Benefits</h3>
                 <Toggle 
                    label="Maternity & Newborn Cover" 
                    info="Waiting period of 2 years applies."
                    checked={features.maternity} 
                    onChange={() => toggleFeature('maternity')} 
                 />
                 <Toggle 
                    label="OPD Consultation Cover" 
                    info="Includes Tele-consultations."
                    checked={features.opd} 
                    onChange={() => toggleFeature('opd')} 
                 />
              </div>
            </div>

            {/* C. ADD-ON RIDERS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
               <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="text-[#1A5EDB]" size={20} /> Boost Your Protection (Add-ons)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'unlimited', label: 'Unlimited Restoration', price: 1200 },
                  { key: 'superNcb', label: 'Super NCB (10x)', price: 800 },
                  { key: 'accidental', label: 'Personal Accident Cover', price: 600 },
                  { key: 'inflation', label: 'Inflation Protector', price: 400 },
                ].map((rider) => (
                  <label key={rider.key} className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${riders[rider.key] ? 'border-[#1A5EDB] bg-[#1A5EDB]/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 checked:bg-[#1A5EDB] checked:border-[#1A5EDB] transition-all"
                        checked={riders[rider.key]}
                        onChange={() => toggleRider(rider.key)}
                      />
                      <Check size={14} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 top-0.5 left-0.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 block">{rider.label}</span>
                      <span className="text-xs text-gray-500">+₹{rider.price}/year</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: STICKY SUMMARY (4 COLS) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-blue-100 overflow-hidden">
                <div className="bg-[#1A5EDB] p-6 text-white text-center">
                   <p className="text-blue-200 text-sm font-medium uppercase tracking-wide">Estimated Premium</p>
                   <div className="flex justify-center items-baseline gap-1 mt-2">
                     <span className="text-4xl font-bold">₹{premium.toLocaleString()}</span>
                     <span className="text-blue-200 text-sm">/ year</span>
                   </div>
                </div>

                <div className="p-6 space-y-4">
                  
                  {/* Summary Rows */}
                  <div className="flex justify-between text-sm pb-3 border-b border-gray-100">
                    <span className="text-gray-500">Plan Selected</span>
                    <span className="font-semibold text-gray-900">{plans.find(p => p.id === selectedPlanId)?.name}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm pb-3 border-b border-gray-100">
                    <span className="text-gray-500">Sum Insured</span>
                    <span className="font-semibold text-gray-900">₹{sumInsured} Lakhs</span>
                  </div>

                  <div className="flex justify-between text-sm pb-3 border-b border-gray-100">
                    <span className="text-gray-500">Room Type</span>
                    <span className="font-semibold text-gray-900 capitalize">{roomType.replace('single', 'Private AC')}</span>
                  </div>

                  {/* Active Add-ons List */}
                  <div className="pt-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Active Add-ons</span>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(riders).filter(k => riders[k]).length === 0 && <span className="text-xs text-gray-400 italic">None selected</span>}
                      {riders.unlimited && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">Unlimited Restore</span>}
                      {riders.accidental && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">Accident Cover</span>}
                      {riders.superNcb && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">Super NCB</span>}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 space-y-3">
                    <button className="w-full bg-[#1A5EDB] text-white py-4 rounded-xl font-bold hover:bg-[#1149AE] transition shadow-lg shadow-blue-200 flex justify-center items-center gap-2">
                      Proceed to Buy <ChevronRight size={18} />
                    </button>
                    <button className="w-full bg-white text-gray-600 border border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
                      Save Quote as Draft
                    </button>
                  </div>

                  <p className="text-xs text-center text-gray-400">
                    Tax benefits under Section 80D available.
                  </p>

                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                 <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm">
                   <Info size={20} />
                 </div>
                 <div>
                   <h4 className="font-bold text-blue-900 text-sm">Need help customizing?</h4>
                   <p className="text-xs text-blue-700 mt-1">Our experts can help you build the perfect plan.</p>
                   <button className="text-xs font-bold text-blue-600 mt-2 hover:underline">Request Call Back</button>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// 4. THIS IS THE LINE THAT WAS MISSING IN YOUR ERROR
export default CustomizeHealthPage;