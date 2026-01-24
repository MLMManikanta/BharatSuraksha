import React, { useState } from 'react';
import PlanSelect from '../../../common/PlanSelect';
import { useAuth } from '../../../../context/AuthContext';

const BasicPlan = ({ onSelectPlan }) => {
  const [view, setView] = useState('covered');
  const [selectedSumInsured, setSelectedSumInsured] = useState('');
  const { isAuthenticated } = useAuth();

  const features = [
    { title: 'Sum Insured: ₹3L - ₹5L', icon: '💰' },
    { title: 'Room Rent: 1% of Sum Insured', icon: '🏥' },
    { title: '20% Co-pay Applicable', icon: '📉' },
    { title: 'Ambulance Cover (Up to ₹5k)', icon: '🚑' },
    { title: 'Pre & Post Hospitalization', icon: '📄' },
    { title: 'Daycare Procedures', icon: '💊' },
    { title: 'No Claim Bonus (10%)', icon: '📈' },
    { title: 'Maternity Benefit (Capped)', icon: '🤰' },
    { title: 'Modern & AYUSH Treatment', icon: '🧪' },
    { title: 'Cataract Treatment', icon: '👁️' },
    { title: 'Health Checkup', icon: '🩺' },
    { title: 'Lifelong Renewal', icon: '♾️' },
  ];

  const exclusions = [
    { title: 'Global Coverage', icon: '🌍' },
    { title: 'Air Ambulance', icon: '🚁' },
    { title: 'Adventure Sports Injuries', icon: '🪂' },
    { title: 'Infertility / IVF Treatments', icon: '🧬' },
    { title: 'Cosmetic & Plastic Surgery', icon: '💄' },
    { title: 'Self-Inflicted Injuries', icon: '🤕' },
    { title: 'War & Nuclear Perils', icon: '⚔️' },
    { title: 'Unproven Treatments', icon: '🧪' },
    { title: 'Non-Medical Consumables', icon: '🧤' },
  ];

  const handleSelect = () => {
    onSelectPlan?.({
      name: 'Neev Suraksha',
      sumInsured: selectedSumInsured,
    });
  };

  return (
    <div className="w-full font-sans animate-fade-in-up">
      {/* ---------------- HEADER ---------------- */}
      <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-3xl p-1 shadow-lg mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="bg-white/95 backdrop-blur-sm rounded-[1.3rem] p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-cyan-200"
                aria-hidden="true"
              >
                🧱
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                  Neev Suraksha
                </h2>
                <p className="text-cyan-700 font-medium">
                  The solid foundation for your health.
                </p>
                <p className="text-gray-600 text-sm">
                  Essential coverage at an affordable price.
                </p>
              </div>
            </div>

            {/* ---------------- SELECT + CTA ---------------- */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto bg-gray-100 p-2 rounded-2xl border border-gray-200">
              <PlanSelect
                value={selectedSumInsured}
                onChange={setSelectedSumInsured}
                placeholder="Choose sum insured"
                requiresAuth
                options={[
                  { value: '3L', label: '₹3 Lakhs' },
                  { value: '4L', label: '₹4 Lakhs' },
                  { value: '5L', label: '₹5 Lakhs' },
                ]}
              />

              <button
                onClick={handleSelect}
                disabled={!selectedSumInsured || !isAuthenticated}
                className={`relative overflow-hidden min-h-[44px] px-8 py-3 rounded-xl font-bold shadow-lg transition-all group
                  ${
                    !selectedSumInsured || !isAuthenticated
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-cyan-600 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98]'
                  }
                  focus:outline-none focus:ring-4 focus:ring-cyan-500/40
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span className="relative z-10">
                  {!isAuthenticated ? 'Login to select' : 'Select Plan'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- TOGGLE ---------------- */}
      <div className="flex justify-center mb-10">
        <div className="bg-white p-1.5 rounded-2xl shadow-md border border-gray-200 inline-flex relative w-full sm:w-auto">
          <div
            className={`absolute top-1.5 bottom-1.5 rounded-xl bg-cyan-100 border border-cyan-200 transition-all duration-300
              ${view === 'covered' ? 'left-1.5 right-1/2' : 'left-1/2 right-1.5'}
            `}
          />
          <button
            onClick={() => setView('covered')}
            className={`relative z-10 px-8 py-3 min-h-[44px] font-bold text-sm transition-colors
              ${view === 'covered' ? 'text-cyan-700' : 'text-gray-500 hover:text-gray-700'}
              focus:outline-none focus:ring-4 focus:ring-cyan-500/40
            `}
          >
            <span aria-hidden="true">✅</span> Covered
          </button>
          <button
            onClick={() => setView('not-covered')}
            className={`relative z-10 px-8 py-3 min-h-[44px] font-bold text-sm transition-colors
              ${view === 'not-covered' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}
              focus:outline-none focus:ring-4 focus:ring-cyan-500/40
            `}
          >
            <span aria-hidden="true">❌</span> Exclusions
          </button>
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="min-h-[400px] pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-slide-up">
          {(view === 'covered' ? features : exclusions).map((item, idx) => (
            <div
              key={idx}
              className="group bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full"
            >
              <div
                className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                {item.icon}
              </div>
              <p className="text-sm font-bold text-gray-700 leading-snug">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- ANIMATIONS (UNCHANGED) ---------------- */}
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
