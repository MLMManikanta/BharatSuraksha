import React, { useState } from 'react';

const UniversalCoverage = ({ onSelectPlan }) => {
  const [view, setView] = useState('covered');
  const [selectedSumInsured, setSelectedSumInsured] = useState('1Cr');

  const features = [
    { title: "Global Coverage", icon: "🌍" },
    { title: "100% Claim Coverage", icon: "💯" }, 
    { title: "Global Maternity Cover", icon: "🤰" }, 
    { title: "Non-Deductible Items Covered", icon: "🧾" }, 
    { title: "Free Health Checkup", icon: "🩺" }, 
    { title: "Secure Benefit", icon: "🛡️" },
    { title: "Automatic Restore Benefit", icon: "🔄" },
    { title: "Emergency Air Ambulance", icon: "🚁" },
    { title: "Hospitalisation (Incl. Covid-19)", icon: "🏥" },
    { title: "Pre & Post Hospitalisation", icon: "📄" },
    { title: "Day Care Procedures", icon: "💊" },
    { title: "AYUSH Benefits", icon: "🌿" },
    { title: "Organ Donor Expenses", icon: "🤝" },
    { title: "Domiciliary Expenses", icon: "🏠" },
    { title: "No Sublimit on Medical Treatment", icon: "🔓" },
    { title: "Lifelong Renewal", icon: "♾️" },
  ];

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
          onSelectPlan({ name: 'Vishwa Suraksha', sumInsured: selectedSumInsured });
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-hidden w-full">
      
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        

        <div className="flex items-start gap-5">
          <div className="text-5xl">💎</div>
          <div>
            <h2 className="text-2xl font-bold text-emerald-700">Vishwa Suraksha</h2>
            <p className="text-gray-600 mt-1 max-w-xl text-sm">
              Experience borderless healthcare. Coverage up to ₹99Cr with global validity.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto mt-6 md:mt-0">
            <select
                value={selectedSumInsured}
                onChange={(e) => setSelectedSumInsured(e.target.value)}
                className="p-2 border border-emerald-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-emerald-900 font-medium"
            >
                <option value="50L">₹50 Lakhs</option>
                <option value="1Cr">₹1 Crore</option>
                <option value="2Cr">₹2 Crores</option>
                <option value="5Cr">₹5 Crores</option>
                <option value="Unlimited">Unlimited</option>
            </select>
            <button
                onClick={handleSelect}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700 transition-colors duration-300 w-full sm:w-auto shadow-md shadow-emerald-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
                aria-label={`Select Vishwa Suraksha plan with ${selectedSumInsured} coverage`}
            >
                Select Plan
            </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-gray-100 p-1.5 rounded-xl inline-flex relative" role="group" aria-label="Coverage filter">
          <div 
            className={`absolute top-1.5 bottom-1.5 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out ${
              view === 'covered' ? 'left-1.5 w-[48%]' : 'left-[50%] w-[48%]'
            }`}
          ></div>
          
          <button
            onClick={() => setView('covered')}
            aria-pressed={view === 'covered'}
            className={`relative z-10 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 focus-visible:outline-offset-2 ${
              view === 'covered' ? 'text-emerald-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ✅ What is Covered
          </button>
          <button
            onClick={() => setView('not-covered')}
            aria-pressed={view === 'not-covered'}
            className={`relative z-10 px-8 py-2.5 rounded-lg text-sm font-bold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600 focus-visible:outline-offset-2 ${
              view === 'not-covered' ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ❌ Not Covered
          </button>
        </div>
      </div>

      <div className="min-h-[300px]">
        {view === 'covered' ? (
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in zoom-in-95 duration-300">
            {features.map((item, idx) => (
              <div 
                key={idx} 
                className="w-[45%] md:w-[30%] lg:w-[22%] flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group"
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

export default UniversalCoverage;