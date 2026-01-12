import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../../layout/CheckoutStepper';

// Import Sub-Plans
import BasicPlan from './SubPlans/BasicPlan';
import FamilyShieldPlan from './SubPlans/FamilyShieldPlan';
import SeniorProtectPlan from './SubPlans/SeniorProtectPlan';
import UniversalCoverage from './SubPlans/UniversalCoverage';

// Import Customization Component
import CustomizeHealthPage from './CustomizeHealthPage'; 

const PlanPreExistingSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. RECEIVE DATA FROM STEP 1
  const prevData = location.state || {}; 

  const [activeTab, setActiveTab] = useState('family'); 
  const [customizationData, setCustomizationData] = useState(null); 

  // Redirect if accessed directly without data
  useEffect(() => {
    if (!prevData.counts && !prevData.members) { 
      navigate('/plans');
    }
  }, [prevData, navigate]);

  // --- HANDLERS ---
  const handlePlanSelection = (planDetails) => {
    setCustomizationData({
      ...prevData,
      selectedPlan: planDetails
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateOwn = () => {
    handlePlanSelection({ 
      name: 'Vajra Suraksha Plan', 
      sumInsured: '5L', 
      isCustom: true 
    });
  };

  const handleProceedToReview = (finalSelectionData) => {
    navigate('/plan-review', { state: { ...prevData, ...finalSelectionData } });
  };

  const handleCloseCustomization = () => {
    setCustomizationData(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. STEPPER */}
      <CheckoutStepper currentStep={2} />
      
      {/* 2. HEADER */}
      <div className="bg-[#1A5EDB] text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl relative mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            {customizationData ? `Forging Your ${customizationData.selectedPlan.name}` : 'Select Your Defense'}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {customizationData 
              ? 'Calibrate your Vajra. Total control over coverage and limits.' 
              : 'Choose a standard plan or engage Vajra Suraksha for absolute control.'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        
        {/* --- CONDITIONAL RENDERING --- */}
        
        {/* VIEW A: SHOW PLAN CARDS & TABS */}
        {!customizationData && (
          <>
            {/* TABS (Aggressive "Vajra" Entry) */}
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex flex-wrap md:flex-nowrap justify-between gap-2 mb-8 animate-in fade-in zoom-in duration-300">
              {[
                { id: 'basic', label: 'Basic Care', icon: '👤' },
                { id: 'family', label: 'Family Shield', icon: '👨‍👩‍👧' },
                { id: 'senior', label: 'Senior Protect', icon: '👴' },
                { id: 'universal', label: 'Universal', icon: '💎' },
                // AGGRESSIVE TAB NAME
                { id: 'vajra', label: '⚡ VAJRA SURAKSHA', icon: '', isSpecial: true },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:px-4 rounded-xl font-bold text-xs md:text-sm transition-all ${
                    // Special Styling for Vajra
                    tab.isSpecial 
                        ? activeTab === tab.id 
                            ? 'bg-[#EA580C] text-white shadow-xl scale-[1.05] border-2 border-[#EA580C]' // Deep Orange (Saffron)
                            : 'bg-orange-50 text-[#EA580C] hover:bg-orange-100 border-2 border-dashed border-[#EA580C]' // Inactive Orange
                        : activeTab === tab.id
                            ? 'bg-[#1A5EDB] text-white shadow-md transform scale-[1.02]'
                            : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* PLAN CARDS AREA */}
            <div className="min-h-[500px] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'basic' && <BasicPlan onSelectPlan={handlePlanSelection} />}
              {activeTab === 'family' && <FamilyShieldPlan onSelectPlan={handlePlanSelection} />}
              {activeTab === 'senior' && <SeniorProtectPlan onSelectPlan={handlePlanSelection} />}
              {activeTab === 'universal' && <UniversalCoverage onSelectPlan={handlePlanSelection} />}
              
              {/* 5th Tab: Vajra Card */}
              {activeTab === 'vajra' && (
                <div className="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-2xl border-b-8 border-[#EA580C] relative overflow-hidden group">
                    
                    {/* Background Texture Effect */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-transparent"></div>
                    
                    <div className="w-24 h-24 bg-[#EA580C] text-white rounded-full flex items-center justify-center text-5xl mb-6 shadow-[0_0_20px_rgba(234,88,12,0.5)] z-10 group-hover:scale-110 transition-transform duration-300">
                        ⚡
                    </div>
                    <h2 className="text-4xl font-black text-white mb-2 z-10 uppercase tracking-widest italic">Vajra Suraksha</h2>
                    <p className="text-gray-300 max-w-md mb-8 z-10 font-medium text-lg">
                        Build your fortress. <br/> Indestructible coverage tailored by you.
                    </p>
                    <button 
                        onClick={handleCreateOwn}
                        className="px-10 py-4 bg-[#EA580C] text-white font-extrabold rounded-xl shadow-lg hover:bg-orange-600 hover:shadow-orange-500/50 transition-all transform active:scale-[0.98] z-10 uppercase tracking-wider"
                    >
                        Initialize Builder &rarr;
                    </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* VIEW B: SHOW CUSTOMIZATION PANEL */}
        {customizationData && (
           <div className="animate-in fade-in zoom-in duration-500">
              <CustomizeHealthPage 
                 initialData={customizationData}
                 onProceed={handleProceedToReview}
                 onBack={handleCloseCustomization}
              />
           </div>
        )}

      </div>
    </div>
  );
};

export default PlanPreExistingSelection;