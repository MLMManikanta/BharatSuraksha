import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// UPDATED IMPORTS (Point to SubPlans folder)
import BasicPlan from './SubPlans/BasicPlan';
import FamilyShieldPlan from './SubPlans/FamilyShieldPlan';
import SeniorProtectPlan from './SubPlans/SeniorProtectPlan';
import UniversalCoverage from './SubPlans/UniversalCoverage';

// ... keep the rest of your code exactly the same ...
// (Just copy the imports above and replace the old ones)

const PlanDetails = () => {
  const navigate = useNavigate();

  // Member Selection State
  const [members, setMembers] = useState({
    self: true,
    spouse: false,
    mother: false,
    father: false,
    son: 0,
    daughter: 0
  });

  // Handlers
  const updateCount = (key, operation) => {
    setMembers(prev => ({
      ...prev,
      [key]: operation === 'inc' 
        ? Math.min(prev[key] + 1, 5) 
        : Math.max(prev[key] - 1, 0)
    }));
  };

  const toggleMember = (key) => {
    setMembers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    navigate('/select-plan', { state: { members } });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* PROGRESS HEADER */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-2 text-[#1A5EDB] font-bold">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1A5EDB] bg-blue-50">1</span>
            Members
          </div>
          <div className="w-16 h-1 mx-4 rounded-full bg-gray-200"></div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-gray-300">2</span>
            Select Plan
          </div>
        </div>

        {/* CONTENT */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Who are you insuring?</h1>
          <p className="text-slate-500 mt-2">Select family members to get an accurate premium quote.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div onClick={() => toggleMember('self')} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${members.self ? 'border-[#1A5EDB] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <div className="w-10 h-10 rounded-full bg-[#1A5EDB] text-white flex items-center justify-center">👨</div>
              <span className="font-bold text-slate-700">Self</span>
              {members.self && <span className="ml-auto text-[#1A5EDB]">✓</span>}
            </div>
            <div onClick={() => toggleMember('spouse')} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${members.spouse ? 'border-[#1A5EDB] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center">👩</div>
              <span className="font-bold text-slate-700">Spouse</span>
              {members.spouse && <span className="ml-auto text-[#1A5EDB]">✓</span>}
            </div>
            <div onClick={() => toggleMember('father')} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${members.father ? 'border-[#1A5EDB] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <div className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center">👴</div>
              <span className="font-bold text-slate-700">Father</span>
              {members.father && <span className="ml-auto text-[#1A5EDB]">✓</span>}
            </div>
            <div onClick={() => toggleMember('mother')} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${members.mother ? 'border-[#1A5EDB] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
              <div className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center">👵</div>
              <span className="font-bold text-slate-700">Mother</span>
              {members.mother && <span className="ml-auto text-[#1A5EDB]">✓</span>}
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl border transition ${members.son > 0 ? 'border-[#1A5EDB] bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center">👦</div>
                 <span className="font-bold text-slate-700">Son</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                <button onClick={() => updateCount('son', 'dec')} className="px-3 font-bold text-gray-400 hover:text-[#1A5EDB]">-</button>
                <span className="font-bold w-4 text-center">{members.son}</span>
                <button onClick={() => updateCount('son', 'inc')} className="px-3 font-bold text-gray-400 hover:text-[#1A5EDB]">+</button>
              </div>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl border transition ${members.daughter > 0 ? 'border-[#1A5EDB] bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-pink-400 text-white flex items-center justify-center">👧</div>
                 <span className="font-bold text-slate-700">Daughter</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                <button onClick={() => updateCount('daughter', 'dec')} className="px-3 font-bold text-gray-400 hover:text-[#1A5EDB]">-</button>
                <span className="font-bold w-4 text-center">{members.daughter}</span>
                <button onClick={() => updateCount('daughter', 'inc')} className="px-3 font-bold text-gray-400 hover:text-[#1A5EDB]">+</button>
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleNext} className="w-full py-4 bg-[#1A5EDB] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#1149AE] transition-all text-lg">
          Next: Select Plan &rarr;
        </button>
      </div>
    </div>
  );
};
export default PlanDetails;