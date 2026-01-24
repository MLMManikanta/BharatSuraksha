import React, { useState } from 'react';
import PlanSelect from '../../../common/PlanSelect';
import { useAuth } from '../../../../context/AuthContext';

const FamilyShieldPlan = ({ onSelectPlan, memberCounts = {} }) => {
  const [view, setView] = useState('covered');
  const [selectedSumInsured, setSelectedSumInsured] = useState('');
  const { isAuthenticated } = useAuth();

  /* ---------------- ELIGIBILITY ---------------- */
  const hasSelf = Number(memberCounts.self || 0) > 0;
  const hasSpouse = Number(memberCounts.spouse || 0) > 0;
  const isMaternityEligible = hasSelf && hasSpouse;

  const MATERNITY_LIMITS = {
    '10L': '₹75,000',
    '15L': '₹75,000',
    '20L': '₹1,00,000',
    '25L': '₹1,00,000',
    '50L': '₹2,00,000',
    '1Cr': '₹2,00,000',
  };

  const getMaternityLimit = () =>
    MATERNITY_LIMITS[selectedSumInsured] || '₹75,000';

  /* ---------------- DATA ---------------- */
  const features = [
    { title: 'Any Room Category', icon: '🛏️' },
    ...(isMaternityEligible
      ? [
          {
            title: `Maternity Coverage (Up to ${getMaternityLimit()})`,
            icon: '🤰',
            isDynamic: true,
          },
          { title: 'Newborn Baby Cover', icon: '👶' },
        ]
      : []),
    { title: '100% Restoration of Cover', icon: '🔄' },
    { title: 'Free Annual Health Checkup', icon: '🩺' },
    { title: 'Sum Insured: ₹10L - 1Cr', icon: '💰' },
    { title: '100% Claim Coverage', icon: '💯' },
    { title: 'Day Care Procedures', icon: '💊' },
    { title: 'Pre & Post Hospitalization', icon: '📄' },
    { title: 'No Claim Bonus (50%)', icon: '📈' },
    { title: 'Ayush Treatment', icon: '🌿' },
    { title: 'Ambulance Charges', icon: '🚑' },
    { title: 'Discount on Renewal', icon: '🏷️' },
    { title: 'Non-Deductible Items', icon: '🧾' },
  ];

  const exclusions = [
    ...(!isMaternityEligible
      ? [
          {
            title: 'Maternity Cover (Requires Self + Spouse)',
            icon: '🤰',
            isConditional: true,
          },
          {
            title: 'Newborn Baby Cover (Requires Self + Spouse)',
            icon: '👶',
            isConditional: true,
          },
        ]
      : []),
    { title: 'Infertility / IVF Treatments', icon: '🧬' },
    { title: 'Cosmetic & Plastic Surgery', icon: '💄' },
    { title: 'Self-Inflicted Injuries', icon: '🤕' },
    { title: 'Hazardous Adventure Sports', icon: '🪂' },
    { title: 'War & Nuclear Perils', icon: '⚔️' },
    { title: 'Unproven Treatments', icon: '🧪' },
  ];

  const handleSelect = () => {
    onSelectPlan?.({
      name: 'Parivar Suraksha',
      sumInsured: selectedSumInsured,
    });
  };

  return (
    <div className="w-full font-sans animate-fade-in-up">
      {/* ---------------- HEADER CARD ---------------- */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-1 shadow-xl mb-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="bg-white/95 backdrop-blur-sm rounded-[1.3rem] p-6 md:p-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-purple-200"
                aria-hidden="true"
              >
                👨‍👩‍👧
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                  Parivar Suraksha
                </h2>
                <p className="text-purple-700 font-medium">
                  Complete protection for your loved ones.
                </p>
                <p className="text-gray-600 text-sm">
                  Includes maternity, newborn cover, and any room category.
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
                  { value: '10L', label: '₹10 Lakhs' },
                  { value: '15L', label: '₹15 Lakhs' },
                  { value: '20L', label: '₹20 Lakhs' },
                  { value: '25L', label: '₹25 Lakhs' },
                  { value: '50L', label: '₹50 Lakhs' },
                  { value: '1Cr', label: '₹1 Crore' },
                ]}
              />

              <button
                onClick={handleSelect}
                disabled={!selectedSumInsured || !isAuthenticated}
                className={`relative overflow-hidden min-h-[44px] px-8 py-3 rounded-xl font-bold shadow-lg transition-all group
                  ${
                    !selectedSumInsured || !isAuthenticated
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-purple-600 text-white shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]'
                  }
                  focus:outline-none focus:ring-4 focus:ring-purple-500/40
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
            className={`absolute top-1.5 bottom-1.5 rounded-xl bg-purple-100 border border-purple-200 shadow-sm transition-all duration-300 ease-out
              ${view === 'covered' ? 'left-1.5 right-1/2' : 'left-1/2 right-1.5'}
            `}
          />
          <button
            onClick={() => setView('covered')}
            className={`relative z-10 px-8 py-3 min-h-[44px] font-bold text-sm transition-colors
              ${view === 'covered' ? 'text-purple-700' : 'text-gray-500 hover:text-gray-700'}
              focus:outline-none focus:ring-4 focus:ring-purple-500/40
            `}
          >
            <span aria-hidden="true">✅</span> Covered
          </button>
          <button
            onClick={() => setView('not-covered')}
            className={`relative z-10 px-8 py-3 min-h-[44px] font-bold text-sm transition-colors
              ${view === 'not-covered' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}
              focus:outline-none focus:ring-4 focus:ring-purple-500/40
            `}
          >
            <span aria-hidden="true">❌</span> Exclusions
          </button>
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="min-h-[400px] pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-slide-up">
          {(view === 'covered' ? features : exclusions).map((item, idx) => (
            <div
              key={idx}
              className="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full"
            >
              <div
                className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                {item.icon}
              </div>
              <p
                className="text-sm font-bold text-gray-700 leading-snug"
                aria-live={item.isDynamic ? 'polite' : undefined}
              >
                {item.isDynamic
                  ? `Maternity Coverage (Up to ${getMaternityLimit()})`
                  : item.title}
              </p>
              {item.isConditional && (
                <p className="text-[10px] text-orange-600 mt-1">
                  Add spouse to enable
                </p>
              )}
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

export default FamilyShieldPlan;
