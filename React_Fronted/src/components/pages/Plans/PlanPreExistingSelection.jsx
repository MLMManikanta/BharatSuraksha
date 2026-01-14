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
    
    // Standard Plan Premium Rates (per person per annum)
    // Structure: planName -> { sumInsured -> { ageGroup -> premium } }
    const STANDARD_PLAN_RATES = {
      'Neev Suraksha': {
        '3L': { '18-25': 2445, '26-35': 2570, '36-40': 3245, '41-45': 3815, '46-50': 4782, '51-55': 6475, '56-60': 8040, '61-65': 11335, '66-70': 14585, '71-75': 18665, '76-100': 23000 },
        '4L': { '18-25': 2615, '26-35': 2777, '36-40': 3485, '41-45': 4100, '46-50': 5130, '51-55': 6970, '56-60': 8630, '61-65': 12145, '66-70': 15630, '71-75': 20000, '76-100': 24650 },
        '5L': { '18-25': 2760, '26-35': 2932, '36-40': 3685, '41-45': 4335, '46-50': 5450, '51-55': 7420, '56-60': 9170, '61-65': 12935, '66-70': 16650, '71-75': 21395, '76-100': 26310 }
      },
      'Parivar Suraksha': {
        '5L': { '18-25': 3261, '26-35': 3444, '36-40': 4365, '41-45': 5120, '46-50': 6445, '51-55': 8775, '56-60': 10845, '61-65': 15270, '66-70': 19755, '71-75': 25275, '76-100': 31145 },
        '10L': { '18-25': 4230, '26-35': 4485, '36-40': 5670, '41-45': 6650, '46-50': 8370, '51-55': 11385, '56-60': 14065, '61-65': 19805, '66-70': 25590, '71-75': 32755, '76-100': 40345 }
      },
      'Varishtha Suraksha': {
        '5L': { '18-25': 3780, '26-35': 3985, '36-40': 5055, '41-45': 5925, '46-50': 7460, '51-55': 10150, '56-60': 12540, '61-65': 17670, '66-70': 22870, '71-75': 29245, '76-100': 36045 },
        '10L': { '18-25': 4895, '26-35': 5190, '36-40': 6560, '41-45': 7695, '46-50': 9685, '51-55': 13165, '56-60': 16280, '61-65': 22930, '66-70': 29620, '71-75': 37900, '76-100': 46700 }
      },
      'Vishwa Suraksha': {
        '5L': { '18-25': 4570, '26-35': 4820, '36-40': 6110, '41-45': 7165, '46-50': 9020, '51-55': 12280, '56-60': 15165, '61-65': 21380, '66-70': 27645, '71-75': 35360, '76-100': 43590 },
        '10L': { '18-25': 5920, '26-35': 6280, '36-40': 7930, '41-45': 9305, '46-50': 11715, '51-55': 15935, '56-60': 19705, '61-65': 27780, '66-70': 35840, '71-75': 45880, '76-100': 56520 }
      }
    };

    // Calculate premium based on plan type and member ages
    let calculatedPremium = 0;
    const planRates = STANDARD_PLAN_RATES[planDetails.name];
    
    if (planRates) {
      // Use rates for selected sum insured
      const ratesByAge = planRates[siLabel];
      if (ratesByAge && prevData.memberAges) {
        // Calculate based on actual member ages
        const memberAges = prevData.memberAges || {};
        const memberCounts = prevData.counts || {};
        
        Object.keys(memberCounts).forEach(memberId => {
          const count = memberCounts[memberId];
          if (count > 0) {
            const ages = Array.isArray(memberAges[memberId]) ? memberAges[memberId] : [memberAges[memberId]];
            ages.forEach(age => {
              if (age) {
                const ageNum = parseInt(age);
                let ageGroup = '18-25';
                if (ageNum >= 26 && ageNum <= 35) ageGroup = '26-35';
                else if (ageNum >= 36 && ageNum <= 40) ageGroup = '36-40';
                else if (ageNum >= 41 && ageNum <= 45) ageGroup = '41-45';
                else if (ageNum >= 46 && ageNum <= 50) ageGroup = '46-50';
                else if (ageNum >= 51 && ageNum <= 55) ageGroup = '51-55';
                else if (ageNum >= 56 && ageNum <= 60) ageGroup = '56-60';
                else if (ageNum >= 61 && ageNum <= 65) ageGroup = '61-65';
                else if (ageNum >= 66 && ageNum <= 70) ageGroup = '66-70';
                else if (ageNum >= 71 && ageNum <= 75) ageGroup = '71-75';
                else if (ageNum >= 76) ageGroup = '76-100';
                
                if (ratesByAge[ageGroup]) {
                  calculatedPremium += ratesByAge[ageGroup];
                }
              }
            });
          }
        });
      }
    }

    const payload = {
        selectedPlan: planDetails,
        sumInsured: { label: `₹${siLabel}`, value: siValue },
        roomRent: { label: "Single Private Room", value: "private" },
        hospitalization: { pre: 60, post: 90 },
        tenure: 1,
        activeFeatures: [{ label: 'Standard Coverage', active: true }],
        activeRiders: [],
        basePremium: calculatedPremium > 0 ? calculatedPremium : 8000
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
            {customizationData ? `Customize Vajra Suraksha` : 'Select Your Suraksha'}
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