import React, { useState } from 'react';

const SeniorProtectPlan = ({ onSelectPlan }) => {
  const [view, setView] = useState('covered');
  const [selectedSumInsured, setSelectedSumInsured] = useState('5L');

  const features = [
    { title: "Tele-OPD Consultations", icon: "📞" },
    { title: "Copay Starting @ 5%", icon: "📉" },
    { title: "Pre-existing Disease Cover", icon: "🗓️" },
    { title: "Specific Illness Waiting (1 Yr)", icon: "⏳" },
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

  const exclusions = [
    { title: "Adventure Sport Injuries", icon: "🪂" },
    { title: "Self-Inflicted Injuries", icon: "🤕" },
    { title: "War & Nuclear Perils", icon: "⚔️" },
    { title: "Defense Operations", icon: "🎖️" },
    { title: "Venereal Diseases", icon: "🦠" },
    { title: "Cosmetic Surgery / Obesity", icon: "💄" },
  ];

  const handleSelect = () => {
      if (onSelectPlan) {
          onSelectPlan({ name: 'Varishtha Suraksha', sumInsured: selectedSumInsured });
      }
  };

  return (
    <div className="w-full font-sans animate-fade-in-up">
      
      <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-1 shadow-xl mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 opacity-10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-[1.3rem] p-6 md:p-8 relative z-10">
          
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-r from-orange-600 to-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-md tracking-wider uppercase flex items-center gap-1">
              ⭐ Senior Special
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-orange-100">
                👴
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Varishtha Suraksha</h2>
                <p className="text-orange-700 font-medium mt-1">Dignity and care for the golden years.</p>
                <p className="text-gray-500 text-sm mt-1 max-w-md">Designed for ages 60+. Reduced waiting periods.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto bg-gray-50 p-2 rounded-2xl border border-gray-100 mt-4 md:mt-0">
               <div className="relative">
                 <select
                    value={selectedSumInsured}
                    onChange={(e) => setSelectedSumInsured(e.target.value)}
                    className="w-full sm:w-auto pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer shadow-sm hover:border-orange-300 transition-colors"
                 >
                    <option value="5L">₹5 Lakhs</option>
                    <option value="10L">₹10 Lakhs</option>
                    <option value="15L">₹15 Lakhs</option>
                    <option value="25L">₹25 Lakhs</option>
                    <option value="50L">₹50 Lakhs</option>
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                 </div>
               </div>
               
               <button
                onClick={handleSelect}
                className="relative overflow-hidden bg-orange-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all group w-full sm:w-auto"
               >
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                 <span>Select Plan</span>
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-white p-1.5 rounded-2xl shadow-md border border-gray-100 inline-flex relative w-full sm:w-auto">
          <div
            className={`absolute top-1.5 bottom-1.5 rounded-xl bg-orange-50 border border-orange-100 shadow-sm transition-all duration-300 ease-out ${
              view === 'covered' ? 'left-1.5 right-[50%]' : 'left-[50%] right-1.5'
            }`}
          ></div>

          <button
            onClick={() => setView('covered')}
            className={`relative z-10 flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
              view === 'covered' ? 'text-orange-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span>✅</span> Covered
          </button>
          <button
            onClick={() => setView('not-covered')}
            className={`relative z-10 flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
              view === 'not-covered' ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span>❌</span> Exclusions
          </button>
        </div>
      </div>

      <div className="min-h-[400px] pb-12">
        {view === 'covered' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-700 leading-snug group-hover:text-orange-700 transition-colors">{item.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
            {exclusions.map((item, idx) => (
              <div
                key={idx}
                className="group bg-red-50/30 p-5 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center h-full opacity-80 hover:opacity-100"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl mb-4 grayscale group-hover:grayscale-0 transition-all border border-red-50">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-700 leading-snug">{item.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SeniorProtectPlan;