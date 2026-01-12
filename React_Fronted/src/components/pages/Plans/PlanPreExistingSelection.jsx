import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// --- IMPORT SUB-PLANS (From the 'SubPlans' folder) ---
import BasicPlan from './SubPlans/BasicPlan';
import FamilyShieldPlan from './SubPlans/FamilyShieldPlan';
import SeniorProtectPlan from './SubPlans/SeniorProtectPlan';
import UniversalCoverage from './SubPlans/UniversalCoverage';

const PlanPreExistingSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the passed data (members) from the previous step
  // Default to empty object if accessed directly
  const members = location.state?.members || {};

  const [activeTab, setActiveTab] = useState('Family');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* 1. WIZARD PROGRESS HEADER */}
        <div className="flex items-center justify-center mb-10">
          {/* Step 1: Members (Completed) */}
          <div className="flex items-center gap-2 text-[#1A5EDB] font-bold">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1A5EDB] bg-blue-50">✓</span>
            Members
          </div>
          
          {/* Connector Line */}
          <div className="w-16 h-1 mx-4 rounded-full bg-[#1A5EDB]"></div>
          
          {/* Step 2: Select Plan (Active) */}
          <div className="flex items-center gap-2 text-[#1A5EDB] font-bold">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1A5EDB] bg-blue-50">2</span>
            Select Plan
          </div>
        </div>

        {/* 2. BACK BUTTON & PAGE TITLE */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-[#1A5EDB] font-bold text-sm flex items-center gap-1 transition-colors"
          >
            &larr; Back
          </button>
          <h2 className="text-2xl font-bold text-slate-900 mx-auto pr-10">Select Your Coverage</h2>
        </div>

        {/* 3. PLAN SELECTION TABS */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
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

        {/* 4. ACTIVE PLAN DISPLAY AREA */}
        {/* This renders the specific component based on the active tab */}
        <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {activeTab === 'Basic' && <BasicPlan />}
          {activeTab === 'Family' && <FamilyShieldPlan />}
          {activeTab === 'Senior' && <SeniorProtectPlan />}
          {activeTab === 'Universal' && <UniversalCoverage />}
        </div>

        {/* 5. ACTION BUTTONS (Proceed or Customize) */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => alert("Proceeding to Payment Gateway...")}
            className="w-full py-4 bg-[#1A5EDB] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#1149AE] transition-all text-lg transform active:scale-[0.99]"
          >
              Proceed to Payment
          </button>

          <div className="text-center pt-2 pb-8">
              <p className="text-sm text-gray-500 mb-2">Need to fine-tune your policy details?</p>
              <Link to="/customize" className="inline-flex items-center gap-2 text-[#1A5EDB] font-bold hover:underline">
                 Advanced Customization &rarr;
              </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlanPreExistingSelection;