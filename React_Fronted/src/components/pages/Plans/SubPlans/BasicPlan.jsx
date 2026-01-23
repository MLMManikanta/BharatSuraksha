import React, { useState } from 'react';
import LockedSelect from '../../../common/LockedSelect';
import { useAuth } from '../../../../context/AuthContext';

const BasicPlan = ({ onSelectPlan }) => { 
  const [view, setView] = useState('covered');
  const [selectedSumInsured, setSelectedSumInsured] = useState('');
  const { isAuthenticated } = useAuth();

  const features = [
    { title: "Sum Insured: ₹3L - ₹5L", icon: "💰" },
    { title: "Room Rent: 1% of Sum Insured", icon: "🏥" },
    { title: "20% Co-pay Applicable", icon: "📉" },
    { title: "Ambulance Cover (Up to ₹5k)", icon: "🚑" },
    { title: "Pre & Post Hospitalization", icon: "📄" },
    { title: "Daycare Procedures", icon: "💊" },
    { title: "No Claim Bonus (10%)", icon: "📈" },
    { title: "Maternity Benefit (Capped)", icon: "🤰" },
    { title: "Modern & AYUSH Treatment", icon: "🧪" },
    { title: "Cataract Treatment", icon: "👁️" },
    { title: "Health Checkup", icon: "🩺" },
    { title: "Lifelong Renewal", icon: "♾️" },
  ];

  const exclusions = [
    { title: "Global Coverage", icon: "🌍" },
    { title: "Air Ambulance", icon: "🚁" },
    { title: "Adventure Sports Injuries", icon: "🪂" },
    { title: "Infertility / IVF Treatments", icon: "🧬" },
    { title: "Cosmetic & Plastic Surgery", icon: "💄" },
    { title: "Self-Inflicted Injuries", icon: "🤕" },
    { title: "War & Nuclear Perils", icon: "⚔️" },
    { title: "Unproven Treatments", icon: "🧪" },
    { title: "Non-Medical Consumables", icon: "🧤" },
  ];

  const handleSelect = () => {
      if (onSelectPlan) {
          onSelectPlan({ name: 'Neev Suraksha', sumInsured: selectedSumInsured });
      }
  };

  return (
    <div className="w-full font-sans animate-fade-in-up">
      
      <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-3xl p-1 shadow-lg mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-[1.3rem] p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-cyan-100">
                🧱
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Neev Suraksha</h2>
                <p className="text-cyan-700 font-medium mt-1">The solid foundation for your health.</p>
                <p className="text-gray-500 text-sm mt-1 max-w-md">Essential coverage at an affordable price.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto bg-gray-50 p-2 rounded-2xl border border-gray-100">
               <div className="relative w-full sm:w-auto">
                 <LockedSelect
                   label={null}
                   value={selectedSumInsured}
                   onChange={setSelectedSumInsured}
                   placeholder="Choose sum insured"
                   requiresAuth={true}
                   options={[
                     { value: '3L', label: '₹3 Lakhs' },
                     { value: '4L', label: '₹4 Lakhs' },
                     { value: '5L', label: '₹5 Lakhs' },
                   ]}
                 />
               </div>
               
               <button
                onClick={handleSelect}
                disabled={!selectedSumInsured || !isAuthenticated}
                className={`relative overflow-hidden px-8 py-3 rounded-xl font-bold shadow-lg transition-all group w-full sm:w-auto ${!selectedSumInsured || !isAuthenticated ? 'bg-gray-300 cursor-not-allowed text-gray-600' : 'bg-cyan-600 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98]'}`}
               >
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                 <span>{!isAuthenticated ? 'Login to select' : 'Select Plan'}</span>
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10">
        <div className="bg-white p-1.5 rounded-2xl shadow-md border border-gray-100 inline-flex relative w-full sm:w-auto">
          <div
            className={`absolute top-1.5 bottom-1.5 rounded-xl bg-cyan-50 border border-cyan-100 shadow-sm transition-all duration-300 ease-out ${
              view === 'covered' ? 'left-1.5 right-[50%]' : 'left-[50%] right-1.5'
            }`}
          ></div>

          <button
            onClick={() => setView('covered')}
            className={`relative z-10 flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${
              view === 'covered' ? 'text-cyan-700' : 'text-gray-400 hover:text-gray-600'
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
                className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-cyan-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full"
              >
                <div className="w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <p className="text-sm font-bold text-gray-700 leading-snug group-hover:text-cyan-700 transition-colors">{item.title}</p>
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

export default BasicPlan;