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

    // Varishtha eligibility: restrict to members aged 60+
    if (planDetails.name === 'Varishtha Suraksha') {
      const memberAges = prevData.memberAges || {};
      const memberCounts = prevData.counts || {};
      const hasUnder60 = Object.keys(memberCounts).some(memberId => {
        if (memberCounts[memberId] > 0) {
          const ages = Array.isArray(memberAges[memberId]) ? memberAges[memberId] : [memberAges[memberId]];
          return ages.some(age => {
            const ageNum = parseInt(age);
            return !Number.isNaN(ageNum) && ageNum < 60;
          });
        }
        return false;
      });

      if (hasUnder60) {
        window.alert('Varishtha Suraksha is available only for members aged 60 and above.');
        return;
      }
    }
    
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
        '10L': { '18-25': 4230, '26-35': 4485, '36-40': 5670, '41-45': 6650, '46-50': 8370, '51-55': 11385, '56-60': 14065, '61-65': 19805, '66-70': 25590, '71-75': 32755, '76-100': 40345 },
        '15L': { '18-25': 5710, '26-35': 6065, '36-40': 7655, '41-45': 8978, '46-50': 11299, '51-55': 15370, '56-60': 18988, '61-65': 26737, '66-70': 34547, '71-75': 44219, '76-100': 54466 },
        '25L': { '18-25': 8030, '26-35': 8522, '36-40': 10773, '41-45': 12667, '46-50': 15903, '51-55': 21632, '56-60': 26724, '61-65': 37630, '66-70': 48621, '71-75': 62235, '76-100': 76656 },
        '50L': { '18-25': 11420, '26-35': 12110, '36-40': 15309, '41-45': 17955, '46-50': 22599, '51-55': 30740, '56-60': 37976, '61-65': 53474, '66-70': 69093, '71-75': 88539, '76-100': 108932 },
        '1Cr': { '18-25': 15230, '26-35': 16146, '36-40': 20412, '41-45': 23940, '46-50': 30132, '51-55': 40986, '56-60': 50634, '61-65': 71298, '66-70': 92124, '71-75': 117918, '76-100': 145242 }
      },
      'Varishtha Suraksha': {
        '5L': { '18-25': 3024, '26-35': 3188, '36-40': 4044, '41-45': 4740, '46-50': 5968, '51-55': 8120, '56-60': 10032, '61-65': 14136, '66-70': 18296, '71-75': 23396, '76-100': 28836 },
        '10L': { '18-25': 3916, '26-35': 4152, '36-40': 5248, '41-45': 6156, '46-50': 7748, '51-55': 10532, '56-60': 13024, '61-65': 18344, '66-70': 23696, '71-75': 30320, '76-100': 37360 }
      },
      'Vishwa Suraksha': {
        '5L': { '18-25': 4570, '26-35': 4820, '36-40': 6110, '41-45': 7165, '46-50': 9020, '51-55': 12280, '56-60': 15165, '61-65': 21380, '66-70': 27645, '71-75': 35360, '76-100': 43590 },
        '10L': { '18-25': 5920, '26-35': 6280, '36-40': 7930, '41-45': 9305, '46-50': 11715, '51-55': 15935, '56-60': 19705, '61-65': 27780, '66-70': 35840, '71-75': 45880, '76-100': 56520 },
        '50L': { '18-25': 13680, '26-35': 14520, '36-40': 18369, '41-45': 21553, '46-50': 27119, '51-55': 36888, '56-60': 45606, '61-65': 64222, '66-70': 82911, '71-75': 106181, '76-100': 130698 },
        '1Cr': { '18-25': 18276, '26-35': 19395, '36-40': 24546, '41-45': 28803, '46-50': 36258, '51-55': 49317, '56-60': 60966, '61-65': 85863, '66-70': 110788, '71-75': 141868, '76-100': 174732 },
        '2Cr': { '18-25': 20550, '26-35': 21820, '36-40': 27627, '41-45': 32410, '46-50': 40833, '51-55': 55635, '56-60': 68811, '61-65': 96938, '66-70': 125095, '71-75': 160218, '76-100': 197379 },
        '5Cr': { '18-25': 23508, '26-35': 25002, '36-40': 31634, '41-45': 37145, '46-50': 46813, '51-55': 63794, '56-60': 78950, '61-65': 111267, '66-70': 143633, '71-75': 183953, '76-100': 226628 },
        'Unlimited': { '18-25': 27648, '26-35': 29381, '36-40': 37164, '41-45': 43652, '46-50': 55060, '51-55': 74961, '56-60': 92745, '61-65': 130690, '66-70': 168590, '71-75': 215965, '76-100': 266042 }
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

    let basePremium = calculatedPremium > 0 ? calculatedPremium : 8000;

    // Plan-specific uplifts
    if (planDetails.name === 'Parivar Suraksha') {
      basePremium += 4000;
    }
    if (planDetails.name === 'Neev Suraksha') {
      basePremium += 3000;
    }
    if (planDetails.name === 'Vishwa Suraksha') {
      basePremium += 6000;
    }

    const payload = {
        selectedPlan: planDetails,
        sumInsured: { label: `₹${siLabel}`, value: siValue },
        roomRent: { label: "Single Private Room", value: "private" },
        hospitalization: { pre: 60, post: 90 },
        tenure: 1,
        activeFeatures: [{ label: 'Standard Coverage', active: true }],
        activeRiders: [],
        basePremium
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
          ].filter((tab) => {
            // Hide Varishtha tab if any member is under 60
            if (tab.id === 'varishtha') {
              const memberAges = prevData.memberAges || {};
              const memberCounts = prevData.counts || {};
              const hasUnder60 = Object.keys(memberCounts).some(memberId => {
                if (memberCounts[memberId] > 0) {
                  const ages = Array.isArray(memberAges[memberId]) ? memberAges[memberId] : [memberAges[memberId]];
                  return ages.some(age => {
                    const ageNum = parseInt(age);
                    return !Number.isNaN(ageNum) && ageNum < 60;
                  });
                }
                return false;
              });
              return !hasUnder60;
            }
            return true;
          }).map((tab) => (
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