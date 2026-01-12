import React, { useState } from 'react';

const SeniorProtectPlan = ({ onSelectPlan }) => {
  const [view, setView] = useState('covered');
  const [selectedSumInsured, setSelectedSumInsured] = useState('5L'); 

  // --- 1. FEATURES LIST (Senior Focused) ---
  const features = [
    { title: "Tele-OPD Consultations", icon: "📞" },
    { title: "Copay Starting @ 5%", icon: "📉" },
    { title: "Pre-existing Disease Cover (from Day 31)", icon: "🗓️" },
    { title: "Specific Illness Waiting (1 Year)", icon: "⏳" },
    { title: "Customizable Room Rent", icon: "🛏️" },
    { title: "Deductible Benefit Options", icon: "🛡️" },
    { title: "Annual Health Checkup", icon: "🩺" },
    { title: "Day Care Procedures", icon: "💊" },
    { title: "Domiciliary Hospitalization", icon: "🏠" },
    { title: "AYUSH Treatment", icon: "🌿" },
    { title: "Organ Donor Expenses", icon: "🤝" },
    { title: "Ambulance Cover", icon: "🚑" },
    { title: "No Claim Bonus", icon: "📈" },
    { title: "Lifelong Renewal", icon: "♾️" },
  ];

  // --- 2. EXCLUSIONS LIST ---
  const exclusions = [
    { title: "Adventure Sport Injuries", icon: "🪂" },
    { title: "Self-Inflicted Injuries", icon: "🤕" },
    { title: "War & Nuclear Perils", icon: "⚔️" },
    { title: "Participation In Defense Operations", icon: "🎖️" },
    { title: "Venereal / Sexually Transmitted Diseases", icon: "🦠" },
    { title: "Treatment Of Obesity Or Cosmetic Surgery", icon: "💄" },
  ];

  const handleSelect = () => {
      if (onSelectPlan) {
          onSelectPlan({ name: 'Varishtha Suraksha', sumInsured: selectedSumInsured });
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. HEADER with Dropdown (Orange Theme) */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Badge */}
        <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-sm">
            SENIOR SPECIAL
        </div>

        <div className="flex items-start gap-5">
          <div className="text-5xl">👴</div>
          <div>
            <h2 className="text-2xl font-bold text-orange-700">Varishtha Suraksha</h2>
            <p className="text-gray-600 mt-1 max-w-xl text-sm">
              Designed for ages 60+. Reduced waiting periods and flexible copay options.
            </p>
          </div>
        </div>

        {/* Sum Insured Dropdown and Select Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto mt-6 md:mt-0">
            <select
                value={selectedSumInsured}
                onChange={(e) => setSelectedSumInsured(e.target.value)}
                className="p-2 border border-orange-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-orange-900 font-medium"
            >
                <option value="5L">₹5 Lakhs</option>
                <option value="10L">₹10 Lakhs</option>
                <option value="15L">₹15 Lakhs</option>
                <option value="25L">₹25 Lakhs</option>
                <option value="50L">₹50 Lakhs</option>
            </select>
            <button
                onClick={handleSelect}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors duration-300 w-full sm:w-auto shadow-md shadow-orange-200"
            >
                Select Plan
            </button>
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
              view === 'covered' ? 'text-orange-700' : 'text-gray-500 hover:text-gray-700'
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
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="w-[45%] md:w-[30%] lg:w-[22%] flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 group"
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

export default SeniorProtectPlan;