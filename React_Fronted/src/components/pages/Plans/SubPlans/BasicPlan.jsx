import React, { useState } from 'react';

const BasicPlan = ({ onSelectPlan }) => { // Accept onSelectPlan prop
  const [view, setView] = useState('covered');
  const [selectedSumInsured, setSelectedSumInsured] = useState('5L'); // Default value

  // ... (features and exclusions arrays remain the same) ...
  const features = [
    { title: "Sum Insured: ₹3L - ₹5L", icon: "💰" },
    { title: "Room Rent: 1% of Sum Insured", icon: "🏥" },
    { title: "20% Co-pay Applicable", icon: "📉" },
    { title: "Ambulance Cover (Up to ₹5k)", icon: "🚑" },
    { title: "Pre & Post Hospitalization (30 Days)", icon: "📄" },
    { title: "Daycare Procedures", icon: "💊" },
    { title: "No Claim Bonus (10% per year)", icon: "📈" },
    { title: "Maternity Benefit (Capped)", icon: "🤰" },
    { title: "Modern & AYUSH Treatment (Flexible Limits)", icon: "🧪" },
    { title: "Cataract Treatment", icon: "👁️" },
    { title: "Health Checkup", icon: "🩺" },
    { title: "Lifelong Renewal", icon: "♾️" },
  ];

  const exclusions = [
    { title: "Global Coverage", icon: "🌍" },
    { title: "Air Ambulance", icon: "🚁" },
    { title: "Private AC / Suite Rooms", icon: "✨" },
    { title: "Adventure Sports Injuries", icon: "🪂" },
    { title: "OPD Consultations", icon: "👨‍⚕️" },
    { title: "Non-Medical Expenses (Consumables)", icon: "🧤" },
  ];

  const handleSelect = () => {
      // Pass selected plan details to parent component for navigation
      if (onSelectPlan) {
          onSelectPlan({ name: 'Basic Care Plan', sumInsured: selectedSumInsured });
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. HEADER with Dropdown */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-5">
          <div className="text-5xl">👤</div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A5EDB]">Basic Care Plan</h2>
            <p className="text-gray-600 mt-1 max-w-xl text-sm">
              Perfect for individuals just starting out. Essential coverage at an affordable price.
            </p>
          </div>
        </div>

        {/* Sum Insured Dropdown and Select Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
            <select
                value={selectedSumInsured}
                onChange={(e) => setSelectedSumInsured(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="3L">₹3 Lakhs</option>
                <option value="4L">₹4 Lakhs</option>
                <option value="5L">₹5 Lakhs</option>
            </select>
            <button
                onClick={handleSelect}
                className="bg-[#1A5EDB] text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors duration-300 w-full sm:w-auto"
            >
                Select Plan
            </button>
        </div>
      </div>

      {/* 2. TOGGLE SWITCH ... (rest of the code remains the same) */}
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

      {/* 3. FLEX GRID DISPLAY (CENTERED ITEMS) ... (rest of the code remains the same) */}
      <div className="min-h-75">
        {view === 'covered' ? (
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="w-[45%] md:w-[30%] lg:w-[22%] flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
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

export default BasicPlan;