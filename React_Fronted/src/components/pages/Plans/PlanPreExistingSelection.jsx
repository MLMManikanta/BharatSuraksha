import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../../layout/CheckoutStepper';

// --- IMPORTS: Standard Sub-Plans ---
import BasicPlan from './SubPlans/BasicPlan';
import FamilyShieldPlan from './SubPlans/FamilyShieldPlan';
import SeniorProtectPlan from './SubPlans/SeniorProtectPlan';
import UniversalCoverage from './SubPlans/UniversalCoverage';
import CustomizeHealthPage from "./SubPlans/CustomizeHealthPage";

const PlanPreExistingSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. RECEIVE DATA & PERSISTENT TAB STATE
  // If we came back from a review page, check if a specific tab was requested
  const prevData = location.state || {}; 
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'parivar');
  const [customizationData, setCustomizationData] = useState(location.state?.customizationData || null); 

  // Sync tab if navigation state updates externally
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    // If coming back from edit, restore customization data
    if (location.state?.customizationData) {
      setCustomizationData(location.state.customizationData);
    }
  }, [location.state]);

  // Redirect safety
  useEffect(() => {
    if (!prevData.counts && !prevData.members) { 
      navigate('/plans');
    }
  }, [prevData, navigate]);

  // --- HANDLERS ---

  const handlePlanSelection = (planDetails) => {
    const siLabel = planDetails.sumInsured || "5L";
    const siValue = parseInt(siLabel.replace('L', '00000').replace('Cr', '0000000'));
    
    let basePrice = 12000; 
    if(planDetails.name.includes('Neev')) basePrice = 8000;
    if(planDetails.name.includes('Varishtha')) basePrice = 15000;
    if(planDetails.name.includes('Vishwa')) basePrice = 25000;

    const payload = {
        selectedPlan: planDetails,
        sumInsured: { label: `₹${siLabel}`, value: siValue },
        roomRent: { label: "Single Private Room", value: "private" },
        hospitalization: { pre: 60, post: 90 },
        tenure: 1,
        activeFeatures: [{ label: 'Standard Coverage', active: true }],
        activeRiders: [],
        basePremium: basePrice + (siValue * 0.005) 
    };

    navigate('/plan-review', { state: { ...prevData, ...payload } });
  };

  const handleActivateVajra = () => {
    setActiveTab('vajra');
    setCustomizationData({
      ...prevData, 
      selectedPlan: { 
        name: 'Vajra Suraksha', 
        sumInsured: '10L', 
        isCustom: true 
      }
    });
  };

  const handleProceedToReview = (finalSelectionData) => {
    navigate('/plan-review', { 
      state: { 
        ...prevData, 
        ...finalSelectionData,
        isReviewingCustomPlan: true  // Flag to show review page, not builder
      } 
    });
  };

  const handleCloseCustomization = () => {
    setCustomizationData(null); 
    setActiveTab('parivar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={2} />
      
      <div className="bg-[#1A5EDB] text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl relative mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">
            {customizationData ? `Forging Vajra Suraksha` : 'Select Your Suraksha'}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {customizationData 
              ? 'Calibrate your elite shield. Full control over every parameter.' 
              : 'Choose a tailored plan to proceed or activate Vajra for ultimate customization.'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex flex-wrap md:flex-nowrap justify-between gap-2 mb-8">
          {[
            { id: 'neev', label: 'Neev', icon: '🧱' },
            { id: 'parivar', label: 'Parivar', icon: '👨‍👩‍👧' },
            { id: 'varishtha', label: 'Varishtha', icon: '👴' },
            { id: 'vishwa', label: 'Vishwa', icon: '💎' },
            { id: 'vajra', label: '⚡ VAJRA', icon: '', isSpecial: true },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.isSpecial ? handleActivateVajra() : (setCustomizationData(null), setActiveTab(tab.id))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 md:px-4 rounded-xl font-bold text-xs md:text-sm transition-all ${
                activeTab === tab.id
                    ? 'bg-[#1A5EDB] text-white shadow-md transform scale-[1.02]'
                    : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">
          {!customizationData ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'neev' && <BasicPlan onSelectPlan={handlePlanSelection} />}
              {activeTab === 'parivar' && <FamilyShieldPlan onSelectPlan={handlePlanSelection} />}
              {activeTab === 'varishtha' && <SeniorProtectPlan onSelectPlan={handlePlanSelection} />}
              {activeTab === 'vishwa' && <UniversalCoverage onSelectPlan={handlePlanSelection} />}
            </div>
          ) : (
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
    </div>
  );
};

export default PlanPreExistingSelection;