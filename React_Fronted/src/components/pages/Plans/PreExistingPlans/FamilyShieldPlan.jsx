import React, { useState } from 'react';

const FamilyShieldPlan = () => {
  const [view, setView] = useState('covered'); // State to toggle views

  // Data: Features matches your screenshot exactly
  const features = [
    { title: "Any Room Category", icon: "🛏️" },
    { title: "Maternity Coverage (Up to ₹2L)", icon: "🤰" }, // Updated limit
    { title: "Newborn Baby Cover Expenses", icon: "👶" },
    { title: "100% Restoration of Cover", icon: "🔄" },
    { title: "Free Annual Health Checkup", icon: "🩺" },
    { title: "Sum Insured: ₹10L to Unlimited", icon: "💰" },
    { title: "100% Claim Coverage", icon: "💯" }, // Added
    { title: "Day Care Procedures", icon: "💊" },
    { title: "Pre & Post Hospitalization", icon: "📄" },
    { title: "No Claim Bonus (50% per year)", icon: "📈" },
    { title: "Ayush Treatment (Ayurveda/Homeo)", icon: "🌿" },
    { title: "Ambulance Charges", icon: "🚑" },
    { title: "Discount on Renewal", icon: "🏷️" }, // Added
    { title: "Non-Deductible Items Covered", icon: "🧾" }, // Added
  ];

  // Data: Exclusions (What is NOT covered)
  const exclusions = [
    { title: "Infertility / IVF Treatments", icon: "🧬" },
    { title: "Cosmetic & Plastic Surgery", icon: "💄" },
    { title: "Self-Inflicted Injuries", icon: "🤕" },
    { title: "Hazardous Adventure Sports", icon: "🪂" },
    { title: "War & Nuclear Perils", icon: "⚔️" },
    { title: "Unproven / Experimental Treatment", icon: "🧪" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HEADER */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-[#1A5EDB] text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm">BEST SELLER</div>
        <div className="flex items-start gap-5">
          <div className="text-5xl">👨‍👩‍👧</div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A5EDB]">Family Shield Plan</h2>
            <p className="text-gray-600 mt-1 max-w-xl text-sm">
              Complete protection for your loved ones. Now includes coverage for any room category, newborn expenses, and non-deductibles.
            </p>
          </div>
        </div>
      </div>

      {/* 2. TOGGLE SWITCH */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1.5 rounded-xl inline-flex relative">
          {/* Slider Background Animation */}
          <div 
            className={`absolute top-1.5 bottom-1.5 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out ${
              view === 'covered' ? 'left-1.5 w-[48%]' : 'left-[50%] w-[48%]'
            }`}
          ></div>
          
          <button
            onClick={() => setView('covered')}
            className={`relative z-10 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 ${
              view === 'covered' ? 'text-[#1A5EDB]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ✅ What is Covered
          </button>
          <button
            onClick={() => setView('not-covered')}
            className={`relative z-10 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 ${
              view === 'not-covered' ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ❌ Not Covered
          </button>
        </div>
      </div>

      {/* 3. FLEX GRID DISPLAY (Centered Items) */}
      <div className="min-h-[300px]">
        {view === 'covered' ? (
          // Using Flex + Justify Center to handle the last row alignment perfectly
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="w-[45%] md:w-[30%] lg:w-[22%] flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform cursor-default">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-700 leading-tight">{item.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            {exclusions.map((item, idx) => (
              <div 
                key={idx} 
                className="w-[45%] md:w-[30%] lg:w-[22%] flex flex-col items-center text-center p-4 bg-red-50/50 border border-red-100 rounded-2xl"
              >
                <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all cursor-not-allowed">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold text-gray-700 leading-tight">{item.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default FamilyShieldPlan;