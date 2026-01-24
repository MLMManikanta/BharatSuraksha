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
  const [activeTab, setActiveTab] = useState(() => location.state?.activeTab || window.localStorage.getItem('planActiveTab') || 'parivar');
  const [customizationData, setCustomizationData] = useState(location.state?.customizationData || null); 
  const [skipRedirect, setSkipRedirect] = useState(false);

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

  // Persist activeTab so a page refresh keeps the same tab
  useEffect(() => {
    try { window.localStorage.setItem('planActiveTab', activeTab); } catch (e) { /* ignore */ }
  }, [activeTab]);

  // Scoped plans loader: show the plans-area loader for exactly 2 seconds
  const [isPlansLoading, setIsPlansLoading] = useState(true);
  useEffect(() => {
    // Show loader on mount, route entry/refresh and when active tab changes
    setIsPlansLoading(true);
    const timer = setTimeout(() => setIsPlansLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [location.pathname, activeTab]);

  const normalizeAges = (value) => {
    if (Array.isArray(value)) return value;
    if (value !== undefined && value !== null && value !== '') return [value];
    return [];
  };

  const coerceAgesByCount = (counts = {}, memberAges = {}) => {
    const normalized = {};
    Object.keys(counts).forEach((key) => {
      const count = Number(counts[key] || 0);
      if (count === 0) {
        normalized[key] = [];
      } else {
        const rawAges = memberAges[key];
        const ages = normalizeAges(rawAges);
        // Ensure we have exactly 'count' entries, preserving existing values
        const result = [];
        for (let i = 0; i < count; i++) {
          const age = ages[i];
          result.push(age !== undefined && age !== null ? age : '');
        }
        normalized[key] = result;
      }
    });
    // Also include non-multi member ages
    Object.keys(memberAges).forEach((key) => {
      if (!(key in normalized)) {
        normalized[key] = memberAges[key];
      }
    });
    return normalized;
  };

  const hasRequiredAges = (counts = {}, memberAges = {}, keys = []) => {
    for (const key of keys) {
      const count = Number(counts[key] || 0);
      if (count === 0) continue;
      
      const ages = normalizeAges(memberAges[key]);
      
      // Check if we have enough ages
      if (ages.length < count) {
        console.log(`❌ hasRequiredAges: ${key} has ${ages.length} ages but needs ${count}`);
        return false;
      }
      
      // Check if all ages up to count are valid (non-empty)
      for (let i = 0; i < count; i++) {
        const age = ages[i];
        if (age === undefined || age === null || String(age).trim() === '') {
          console.log(`❌ hasRequiredAges: ${key}[${i}] is empty or invalid:`, age);
          return false;
        }
      }
    }
    return true;
  };

  const hasMemberData = (data) => {
    const counts = data?.counts || {};
    const members = data?.members || [];
    const memberAges = data?.memberAges || {};
    const hasCounts = Object.values(counts).some((v) => Number(v) > 0);
    const hasMembers = Array.isArray(members) && members.length > 0;

    const ageKeys = ['son', 'daughter'];
    const normalizedMemberAges = coerceAgesByCount(counts, memberAges);
    const hasValidAges = hasRequiredAges(counts, normalizedMemberAges, ageKeys);

    return (hasCounts || hasMembers) && hasValidAges;
  };

  const parseSumInsuredValue = (label) => {
    const clean = String(label || '').replace(/[₹,\s]/g, '');
    if (clean.includes('Cr')) return Math.round(parseFloat(clean.replace('Cr', '')) * 10000000);
    if (clean.includes('L')) return Math.round(parseFloat(clean.replace('L', '')) * 100000);
    const parsed = parseInt(clean, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  // Redirect safety
  useEffect(() => {
  // ✅ Prevent redirect when closing customization
  if (skipRedirect) return;

  if (!hasMemberData(prevData)) { 
    navigate('/plans');
  }
}, [prevData, navigate, skipRedirect]);


  // --- HANDLERS ---

  const handlePlanSelection = (planDetails) => {
    console.log('🔍 handlePlanSelection called with:', planDetails);
    console.log('📊 prevData:', prevData);
    console.log('📊 prevData.counts:', prevData.counts);
    console.log('📊 prevData.memberAges:', prevData.memberAges);
    
    const siLabel = planDetails.sumInsured || "5L";
    const siValue = parseSumInsuredValue(siLabel);

    const memberCounts = prevData.counts || {};
    const memberAgesRaw = prevData.memberAges || {};
    const normalizedMemberAges = coerceAgesByCount(memberCounts, memberAgesRaw);

    console.log('📊 normalizedMemberAges:', normalizedMemberAges);

    // Validate ages for son and daughter
    const sonCount = Number(memberCounts.son || 0);
    const daughterCount = Number(memberCounts.daughter || 0);
    const sonAges = normalizedMemberAges.son || [];
    const daughterAges = normalizedMemberAges.daughter || [];

    console.log(`👦 Sons: count=${sonCount}, ages=`, sonAges);
    console.log(`👧 Daughters: count=${daughterCount}, ages=`, daughterAges);

    if (!hasRequiredAges(memberCounts, normalizedMemberAges, ['son', 'daughter'])) {
      console.error('❌ Age validation failed - blocking navigation');
      window.alert('Please enter age for all selected sons/daughters');
      return;
    }

    console.log('✅ Age validation passed - proceeding with navigation');

    // Standard Plan Premium Rates (per person per annum)
    // Structure: planName -> { sumInsured -> { ageGroup -> premium } }
    const STANDARD_PLAN_RATES = {
      'Neev Suraksha': {
        '3L': { '18-25': 2445, '26-35': 2570, '36-40': 3245, '41-45': 3815, '46-50': 4782, '51-55': 6475, '56-60': 8040, '61-65': 11335, '66-70': 14585, '71-75': 18665, '76-100': 23000 },
        '4L': { '18-25': 2615, '26-35': 2777, '36-40': 3485, '41-45': 4100, '46-50': 5130, '51-55': 6970, '56-60': 8630, '61-65': 12145, '66-70': 15630, '71-75': 20000, '76-100': 24650 },
        '5L': { '18-25': 2760, '26-35': 2932, '36-40': 3685, '41-45': 4335, '46-50': 5450, '51-55': 7420, '56-60': 9170, '61-65': 12935, '66-70': 16650, '71-75': 21395, '76-100': 26310 }
      },
      'Parivar Suraksha': {
        // Premium rates from Parivar_Suraksha_Premium_Model.csv
        '10L': { '18-25': 8500, '26-35': 10662, '36-40': 13374, '41-45': 14979, '46-50': 16777, '51-55': 18790, '56-60': 21045, '61-65': 23571, '66-70': 26399, '71-75': 29567, '76-100': 34002 },
        '15L': { '18-25': 10625, '26-35': 13327, '36-40': 16717, '41-45': 18723, '46-50': 20971, '51-55': 23487, '56-60': 26306, '61-65': 29463, '66-70': 32998, '71-75': 36958, '76-100': 42502 },
        '20L': { '18-25': 12750, '26-35': 15993, '36-40': 20061, '41-45': 22468, '46-50': 25165, '51-55': 28185, '56-60': 31567, '61-65': 35356, '66-70': 39598, '71-75': 44350, '76-100': 51003 },
        '25L': { '18-25': 14875, '26-35': 18658, '36-40': 23404, '41-45': 26213, '46-50': 29359, '51-55': 32882, '56-60': 36828, '61-65': 41249, '66-70': 46198, '71-75': 51742, '76-100': 59503 },
        '50L': { '18-25': 21250, '26-35': 26655, '36-40': 33435, '41-45': 37447, '46-50': 41942, '51-55': 46975, '56-60': 52612, '61-65': 58927, '66-70': 65997, '71-75': 73917, '76-100': 85005 },
        '1Cr': { '18-25': 29750, '26-35': 37317, '36-40': 46809, '41-45': 52426, '46-50': 58719, '51-55': 65765, '56-60': 73657, '61-65': 82498, '66-70': 92396, '71-75': 103484, '76-100': 119007 }
      },
      'Varishtha Suraksha': {
        '5L': {  '60-65': 14136, '66-70': 18296, '71-75': 23396, '76-100': 28836 },
        '10L': {  '60-65': 18344, '66-70': 23696, '71-75': 30320, '76-100': 37360 }
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
      const ratesByAge = planRates[siLabel];
      if (ratesByAge) {
        Object.keys(memberCounts).forEach(memberId => {
          const count = Number(memberCounts[memberId] || 0);
          const ages = normalizeAges(normalizedMemberAges[memberId]);
          if (count > 0 && ages.length > 0) {
            for (let i = 0; i < count; i += 1) {
              const age = ages[i];
              if (!age) continue;
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

    const navigationState = { ...prevData, memberAges: normalizedMemberAges, ...payload };
    console.log('🚀 Navigating to /plan-review with state:', navigationState);
    
    navigate('/plan-review', { state: navigationState });
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
  setSkipRedirect(true);       
  setCustomizationData(null); 
  setActiveTab('parivar');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};


  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={2} />
      
      <div className="bg-[#1A5EDB] text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl relative mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2">
            <span className="text-2xl">📋</span>
            <span className="text-sm font-medium">Step 2 of 8</span>
          </div>
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
              onClick={() => {
                if (tab.isSpecial) {
                  handleActivateVajra();
                } else {
                  setCustomizationData(null);
                  setActiveTab(tab.id);
                }
              }}
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

        <div className="min-h-[500px] relative">
          {/* Content layer: plans or customization -> stays in flow so layout doesn't collapse */}
          <div
            className={`relative w-full transition-opacity transition-transform duration-300 ease-out will-change-opacity will-change-transform flex flex-col ${isPlansLoading ? 'opacity-0 -translate-y-2 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100 pointer-events-auto'}`}
          >
            {!customizationData ? (
              <div className="w-full">
                {activeTab === 'neev' && <BasicPlan onSelectPlan={handlePlanSelection} />}
                {activeTab === 'parivar' && <FamilyShieldPlan onSelectPlan={handlePlanSelection} memberCounts={prevData.counts} />}
                {activeTab === 'varishtha' && <SeniorProtectPlan onSelectPlan={handlePlanSelection} />}
                {activeTab === 'vishwa' && <UniversalCoverage onSelectPlan={handlePlanSelection} />}
              </div>
            ) : (
              <div className="w-full">
                <CustomizeHealthPage 
                   initialData={customizationData}
                   onProceed={handleProceedToReview}
                   onBack={handleCloseCustomization}
                />
              </div>
            )}
          </div>

          {/* Skeleton layer: fades/scales in while loading, positioned over content to avoid layout shift */}
          <div
            aria-hidden={!isPlansLoading}
            className={`absolute inset-0 transition-opacity transition-transform duration-300 ease-out flex items-center justify-center ${isPlansLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="spinner-center absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                </div>
                <div className="spinner-ring absolute inset-0">
                  <div className="ring-dot dot-1" />
                  <div className="ring-dot dot-2" />
                  <div className="ring-dot dot-3" />
                  <div className="ring-dot dot-4" />
                  <div className="ring-dot dot-5" />
                  <div className="ring-dot dot-6" />
                  <div className="ring-dot dot-7" />
                  <div className="ring-dot dot-8" />
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600">Loading plans...</div>
            </div>

            <style>{`
              .spinner-ring { position: relative; width: 100%; height: 100%; transform-origin: center; animation: spin-rotate 900ms linear infinite; }
              .ring-dot { position: absolute; width: 10%; height: 10%; background: transparent; }
              .ring-dot::before { content: ''; display: block; width: 8px; height: 8px; background: #2563eb; border-radius: 50%; transform-origin: center; }
              .ring-dot.dot-1 { left: 50%; top: 4%; transform: translate(-50%, 0); }
              .ring-dot.dot-2 { right: 4%; top: 18%; }
              .ring-dot.dot-3 { right: 4%; bottom: 18%; }
              .ring-dot.dot-4 { left: 50%; bottom: 4%; transform: translate(-50%, 0); }
              .ring-dot.dot-5 { left: 4%; bottom: 18%; }
              .ring-dot.dot-6 { left: 4%; top: 18%; }
              .ring-dot.dot-7 { left: 26%; top: 6%; }
              .ring-dot.dot-8 { right: 26%; bottom: 6%; }

              @keyframes spin-rotate { to { transform: rotate(360deg); } }
              @keyframes pulse-scale { 0% { transform: scale(1); opacity: 1 } 50% { transform: scale(0.6); opacity: 0.5 } 100% { transform: scale(1); opacity: 1 } }
              .spinner-center > div { animation: pulse-scale 900ms ease-in-out infinite; }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPreExistingSelection;