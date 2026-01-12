import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- IMPORT SUB-PLANS ---
import BasicPlan from './SubPlans/BasicPlan';
import FamilyShieldPlan from './SubPlans/FamilyShieldPlan';
import SeniorProtectPlan from './SubPlans/SeniorProtectPlan';
import UniversalCoverage from './SubPlans/UniversalCoverage';

// --- IMPORT CUSTOMIZER COMPONENT ---
import CustomizeHealthPage from './CustomizeHealthPage';

const PlanPreExistingSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the passed data
  const members = location.state?.members || {};
  const proposer = location.state?.proposer || {};

  const [activeTab, setActiveTab] = useState('Family');
  const [isCustomizing, setIsCustomizing] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* 1. PROGRESS HEADER */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-2 text-[#1A5EDB] font-bold">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1A5EDB] bg-blue-50">✓</span>
            Members
          </div>
          <div className="w-16 h-1 mx-4 rounded-full bg-[#1A5EDB]"></div>
          <div className="flex items-center gap-2 text-[#1A5EDB] font-bold">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1A5EDB] bg-blue-50">2</span>
            {isCustomizing ? 'Customize Plan' : 'Select Plan'}
          </div>
        </div>

        {/* 2. BACK BUTTON & TITLE */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => {
              if (isCustomizing) setIsCustomizing(false);
              else navigate(-1);
            }} 
            className="text-gray-400 hover:text-[#1A5EDB] font-bold text-sm flex items-center gap-1 transition-colors"
          >
            &larr; Back
          </button>
          
          {/* GENERIC TITLE - No longer tied to specific plan names */}
          <h2 className="text-2xl font-bold text-slate-900 mx-auto pr-10">
            {isCustomizing ? 'Build Your Own Plan' : 'Select Your Coverage'}
          </h2>
        </div>

        {/* 3. PLAN TABS (HIDDEN WHEN CUSTOMIZING) */}
        {!isCustomizing && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
              {['Basic', 'Family', 'Senior', 'Universal'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 flex-1 md:flex-none ${
                    activeTab === tab
                      ? 'bg-[#1A5EDB] text-white shadow-md'
                      : 'bg-transparent text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {tab} Plan
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. CONTENT AREA */}
        {isCustomizing ? (
          // --- CUSTOMIZE VIEW (Draft Mode) ---
          <CustomizeHealthPage 
             members={members} 
             proposer={proposer}
             onBack={() => setIsCustomizing(false)} 
          />
        ) : (
          // --- STANDARD CARD VIEW ---
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8">
              {activeTab === 'Basic' && <BasicPlan />}
              {activeTab === 'Family' && <FamilyShieldPlan />}
              {activeTab === 'Senior' && <SeniorProtectPlan />}
              {activeTab === 'Universal' && <UniversalCoverage />}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => alert(`Proceeding with ${activeTab} Plan...`)}
                className="w-full py-4 bg-[#1A5EDB] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#1149AE] transition-all text-lg transform active:scale-[0.99]"
              >
                  Proceed to Payment
              </button>

              <div className="text-center pt-2 pb-8">
                  <p className="text-sm text-gray-500 mb-2">Want to build a plan from scratch?</p>
                  <button 
                    onClick={() => setIsCustomizing(true)}
                    className="inline-flex items-center gap-2 text-[#1A5EDB] font-bold hover:underline"
                  >
                     Advanced Customization &rarr;
                  </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PlanPreExistingSelection;