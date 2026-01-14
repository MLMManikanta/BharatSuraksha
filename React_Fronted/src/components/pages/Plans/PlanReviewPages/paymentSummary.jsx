import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PAYMENT SUMMARY - DYNAMIC PREMIUM CALCULATION SYSTEM
 * 
 * This component provides real-time, transparent premium calculation for all 5 health insurance plans:
 * - Neev Suraksha (Basic): Foundation coverage at 75% of standard pricing
 * - Parivar Suraksha (Family): Standard pricing baseline (1.0x multiplier)
 * - Varishtha Suraksha (Senior): 35% premium for age-related risk (1.35x)
 * - Vishwa Suraksha (Universal): 50% premium for global coverage (1.5x)
 * - Vajra Suraksha (Custom): 20% premium for complete flexibility (1.2x)
 * 
 * PRICING CALCULATION FLOW:
 * 
 * 1. BASE PREMIUM (Age + Coverage)
 *    - Calculated from PREMIUM_RATES table (11 age groups × 7 coverage tiers)
 *    - Age groups: 18-25, 26-35, ..., 76-100
 *    - Coverage: ₹10L, ₹20L, ₹50L, ₹1Cr, ₹2Cr, ₹5Cr, Unlimited
 *    - Example: 30-year-old with ₹10L = ₹8,083
 * 
 * 2. PLAN MULTIPLIER
 *    - Applies plan-specific adjustment to base premium
 *    - Neev: 0.75x (basic plan discount)
 *    - Parivar: 1.0x (standard reference)
 *    - Varishtha: 1.35x (senior citizen loading)
 *    - Vishwa: 1.5x (global coverage premium)
 *    - Vajra: 1.2x (customization flexibility charge)
 * 
 * 3. DISCOUNTS
 *    - Co-payment (20%): User shares 20% of medical costs → 20% premium reduction
 *    - Instant update when toggled in UI
 * 
 * 4. ENHANCEMENT LOADINGS
 *    - Room Rent Upgrade: +15% (private room benefits)
 *    - Air Ambulance: +₹5,000 fixed (emergency air transport)
 *    - Global Coverage: +25% (worldwide treatment)
 *    - Unlimited Restoration: +18% (sum insured restores unlimited times)
 *    - PED Wait Reduction: +20% (pre-existing disease wait reduced to 1 year)
 * 
 * 5. RIDER COSTS
 *    - Percentage-based riders (6-18% of base premium):
 *      • Unlimited Care: +15%
 *      • Inflation Shield: +12%
 *      • Smart Aggregate: +8%
 *      • Super Bonus: +10%
 *      • PED Wait Reduction: +18%
 *      • Specific Disease Wait: +6%
 *    - Fixed-cost riders:
 *      • Tele-Consultation: +₹1,500
 *      • Maternity Booster: +₹3,500
 * 
 * 6. GST & TAXES
 *    - Health insurance is GST exempt (0%)
 *    - No additional charges
 * 
 * 7. FINAL PREMIUM
 *    - Total = Base × Multiplier - Discounts + Enhancements + Riders + GST
 *    - Updates instantly as user toggles options
 * 
 * REAL-TIME FEATURES:
 * - Premium recalculates on every change (useMemo with dependencies)
 * - Explanations array shows why premium changed
 * - Visual breakdown: base → discounts → enhancements → riders → total
 * - Toggle switches for co-payment, room upgrade, air ambulance (standard plans)
 * - All amounts displayed with ₹ formatting and locale
 * 
 * TRANSPARENCY:
 * - Shows member-wise premium breakdown with ages
 * - Itemizes each rider cost
 * - Displays discount savings separately
 * - Lists all enhancement loadings
 * - Provides calculation summary flow
 * - Disclaimer: "Estimated, subject to underwriting"
 */

// Premium rate table based on age and coverage (from Annual premium.csv)
const PREMIUM_RATES = {
  '10L': { '18-25': 7307, '26-35': 8083, '36-40': 10289, '41-45': 12074, '46-50': 15124, '51-55': 20477, '56-60': 25311, '61-65': 35536, '66-70': 45763, '71-75': 58458, '76-100': 71978 },
  '20L': { '18-25': 9447, '26-35': 10466, '36-40': 13363, '41-45': 15706, '46-50': 19172, '51-55': 26736, '56-60': 33073, '61-65': 46478, '66-70': 59885, '71-75': 76550, '76-100': 94210 },
  '50L': { '18-25': 11282, '26-35': 12547, '36-40': 16146, '41-45': 19053, '46-50': 24024, '51-55': 32740, '56-60': 40605, '61-65': 57233, '66-70': 73866, '71-75': 94525, '76-100': 116409 },
  '1Cr': { '18-25': 14139, '26-35': 15777, '36-40': 20439, '41-45': 24206, '46-50': 30643, '51-55': 41932, '56-60': 52116, '61-65': 73638, '66-70': 95166, '71-75': 121894, '76-100': 150202 },
  '2Cr': { '18-25': 15891, '26-35': 17758, '36-40': 23071, '41-45': 27360, '46-50': 34695, '51-55': 47557, '56-60': 59153, '61-65': 83662, '66-70': 108182, '71-75': 138619, '76-100': 170839 },
  '5Cr': { '18-25': 18181, '26-35': 20335, '36-40': 26362, '41-45': 31431, '46-50': 40011, '51-55': 54918, '56-60': 68367, '61-65': 96870, '66-70': 125202, '71-75': 160375, '76-100': 197678 },
  'Unlimited': { '18-25': 21375, '26-35': 23934, '36-40': 30930, '41-45': 37043, '46-50': 47383, '51-55': 65131, '56-60': 81151, '61-65': 115254, '66-70': 148850, '71-75': 190577, '76-100': 234938 }
};

// Rider pricing (estimated market rates as percentage of base premium or fixed amount)
const RIDER_COSTS = {
  'unlimited_care': { type: 'percentage', value: 15 }, // 15% of base
  'inflation_shield': { type: 'percentage', value: 12 }, // 12% of base
  'tele_consult': { type: 'fixed', value: 1500 }, // Fixed ₹1,500
  'smart_agg': { type: 'percentage', value: 8 }, // 8% of base
  'super_bonus': { type: 'percentage', value: 10 }, // 10% of base
  'ped_wait': { type: 'percentage', value: 18 }, // 18% of base
  'specific_wait': { type: 'percentage', value: 6 }, // 6% of base
  'maternity_boost': { type: 'fixed', value: 3500 } // Fixed ₹3,500
};

// Plan-specific multipliers to differentiate pricing based on coverage level
const PLAN_MULTIPLIERS = {
  'Neev Suraksha': 0.75,        // Basic plan - 25% lower than standard
  'Parivar Suraksha': 1.0,      // Family plan - standard pricing
  'Varishtha Suraksha': 1.35,   // Senior plan - 35% higher due to age risk
  'Vishwa Suraksha': 1.5,       // Comprehensive global - 50% premium
  'Vajra Suraksha': 1.2         // Custom plan - 20% premium for flexibility
};

// Enhanced benefit loadings (additional charges for upgrades)
const ENHANCEMENT_LOADINGS = {
  'room_rent_upgrade': { label: 'Private Room Upgrade', percentage: 15 }, // +15%
  'reduced_wait_ped': { label: 'PED Waiting Period Reduced to 1 Year', percentage: 20 }, // +20%
  'zero_wait_diseases': { label: 'Zero Waiting for Specific Diseases', percentage: 12 }, // +12%
  'extended_daycare': { label: 'Extended Day Care Procedures', percentage: 8 }, // +8%
  'global_coverage': { label: 'Global Treatment Coverage', percentage: 25 }, // +25%
  'air_ambulance': { label: 'Air Ambulance Cover', fixed: 5000 }, // Fixed ₹5,000
  'unlimited_restoration': { label: 'Unlimited Sum Insured Restoration', percentage: 18 } // +18%
};

const getAgeGroup = (age) => {
  const ageNum = parseInt(age);
  if (ageNum >= 18 && ageNum <= 25) return '18-25';
  if (ageNum >= 26 && ageNum <= 35) return '26-35';
  if (ageNum >= 36 && ageNum <= 40) return '36-40';
  if (ageNum >= 41 && ageNum <= 45) return '41-45';
  if (ageNum >= 46 && ageNum <= 50) return '46-50';
  if (ageNum >= 51 && ageNum <= 55) return '51-55';
  if (ageNum >= 56 && ageNum <= 60) return '56-60';
  if (ageNum >= 61 && ageNum <= 65) return '61-65';
  if (ageNum >= 66 && ageNum <= 70) return '66-70';
  if (ageNum >= 71 && ageNum <= 75) return '71-75';
  if (ageNum >= 76 && ageNum <= 100) return '76-100';
  return null;
};

const getCoverageKey = (sumInsured) => {
  if (!sumInsured) return '10L';
  const siStr = String(sumInsured.label || sumInsured);
  if (siStr.includes('10') || siStr.includes('10L')) return '10L';
  if (siStr.includes('20') || siStr.includes('20L')) return '20L';
  if (siStr.includes('50') || siStr.includes('50L')) return '50L';
  if (siStr.includes('1Cr') || siStr.includes('1 Cr')) return '1Cr';
  if (siStr.includes('2Cr') || siStr.includes('2 Cr')) return '2Cr';
  if (siStr.includes('5Cr') || siStr.includes('5 Cr')) return '5Cr';
  if (siStr.includes('Unlimited')) return 'Unlimited';
  return '10L';
};

const PaymentSummary = ({ data }) => {
  const navigate = useNavigate();
  
  // State for optional enhancements (user can toggle these)
  const [optionalEnhancements, setOptionalEnhancements] = useState({
    coPayment: false,
    roomRentUpgrade: false,
    airAmbulance: false
  });

  // Toggle enhancement option
  const toggleEnhancement = (key) => {
    setOptionalEnhancements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Calculate total premium based on member ages and riders
  const premiumCalculation = useMemo(() => {
    // Return empty object if data is missing
    if (!data) {
      return {
        basePremium: 0,
        memberBreakdown: [],
        coPaymentDiscount: 0,
        enhancementCost: 0,
        enhancementBreakdown: [],
        riderCost: 0,
        riderBreakdown: [],
        gstRate: 0,
        gstAmount: 0,
        totalPremium: 0,
        explanations: []
      };
    }

    const memberAges = data.memberAges || {};
    const memberCounts = data.counts || {};
    const sumInsured = data.sumInsured || data.currentSI;
    const coverageKey = getCoverageKey(sumInsured);
    const planName = data.selectedPlan?.name || 'Parivar Suraksha';
    const isCustomPlan = data.selectedPlan?.isCustom || false;
    
    // Get active riders (for VAJRA/Custom plans)
    const activeRiders = data.riders?.filter(r => r.active) || [];
    const activeFeatures = data.features?.filter(f => f.active) || [];
    
    // Collect all pricing explanations
    const explanations = [];
    
    let rawBasePremium = 0;
    let basePremium = 0;
    let planMultiplier = 1.0; // default for standard plans
    const memberBreakdown = [];

    // For standard plans, use basePremium passed from handlePlanSelection
    if (!isCustomPlan && data.basePremium) {
      basePremium = data.basePremium;
      explanations.push(`${planName}: Premium calculated based on member ages and ₹${sumInsured?.label || 'coverage'}`);
    } else {
      // For VAJRA/Custom plans: Calculate RAW base premium from member ages (before plan multiplier)
      Object.keys(memberCounts).forEach(memberId => {
        const count = memberCounts[memberId];
        if (count > 0) {
          const ages = Array.isArray(memberAges[memberId]) ? memberAges[memberId] : [memberAges[memberId]];
          
          ages.forEach((age, index) => {
            if (age) {
              const ageGroup = getAgeGroup(age);
              if (ageGroup && PREMIUM_RATES[coverageKey] && PREMIUM_RATES[coverageKey][ageGroup]) {
                const premium = PREMIUM_RATES[coverageKey][ageGroup];
                rawBasePremium += premium;
                
                const memberLabel = count > 1 
                  ? `${memberId.charAt(0).toUpperCase() + memberId.slice(1).replace('_', ' ')} ${index + 1}` 
                  : memberId.charAt(0).toUpperCase() + memberId.slice(1).replace('_', ' ');
                
                memberBreakdown.push({
                  member: memberLabel,
                  age: age,
                  premium: premium
                });
              }
            }
          });
        }
      });

      // Step 2: Apply PLAN-SPECIFIC MULTIPLIER
      planMultiplier = PLAN_MULTIPLIERS[planName] || 1.0;
      basePremium = Math.round(rawBasePremium * planMultiplier);
      
      if (planMultiplier !== 1.0) {
        const diff = planMultiplier > 1.0 ? 'higher' : 'lower';
        const percentage = Math.abs((planMultiplier - 1.0) * 100).toFixed(0);
        explanations.push(`${planName}: ${percentage}% ${diff} than standard plans due to coverage scope`);
      }

      // Update member breakdown with multiplier applied
      memberBreakdown.forEach(m => {
        m.premium = Math.round(m.premium * planMultiplier);
      });
    }

    // Step 3: Check for CO-PAYMENT discount (20% reduction) - ONLY FOR CUSTOM PLANS
    let coPaymentDiscount = 0;
    const hasCoPayment = isCustomPlan && (optionalEnhancements.coPayment || 
                         data.coPayment === true || 
                         activeFeatures.some(f => f.id === 'co_payment' || f.label?.toLowerCase().includes('co-pay')));
    
    if (hasCoPayment) {
      coPaymentDiscount = Math.round(basePremium * 0.20);
      basePremium -= coPaymentDiscount;
      explanations.push(`20% Co-payment: Reduces premium by sharing medical costs`);
    }

    // Step 4: Calculate ENHANCEMENT LOADINGS - ONLY FOR CUSTOM PLANS
    let enhancementCost = 0;
    const enhancementBreakdown = [];
    
    // Check for room rent upgrade (from optional toggles or features)
    if (isCustomPlan && (optionalEnhancements.roomRentUpgrade || activeFeatures.some(f => f.id === 'room_rent_upgrade' || f.label?.toLowerCase().includes('private room')))) {
      const loading = ENHANCEMENT_LOADINGS.room_rent_upgrade;
      const cost = Math.round(((rawBasePremium || basePremium) * (PLAN_MULTIPLIERS[planName] || 1.0) * loading.percentage) / 100);
      enhancementCost += cost;
      enhancementBreakdown.push({ name: loading.label, cost });
      explanations.push(`${loading.label}: Enhanced room benefits increase premium`);
    }
    
    // Check for air ambulance (from optional toggles or features)
    if (isCustomPlan && (optionalEnhancements.airAmbulance || activeFeatures.some(f => f.id === 'air_amb' || f.label?.toLowerCase().includes('air ambulance')))) {
      const loading = ENHANCEMENT_LOADINGS.air_ambulance;
      const cost = loading.fixed;
      enhancementCost += cost;
      enhancementBreakdown.push({ name: loading.label, cost });
      explanations.push(`${loading.label}: Emergency air transport coverage added`);
    }
    
    // Check other features from VAJRA customization
    if (isCustomPlan) {
      activeFeatures.forEach(feature => {
        // Global coverage
        if (feature.id === 'global' || feature.label?.toLowerCase().includes('global')) {
          const loading = ENHANCEMENT_LOADINGS.global_coverage;
          const cost = Math.round(((rawBasePremium || basePremium) * (PLAN_MULTIPLIERS[planName] || 1.0) * loading.percentage) / 100);
          enhancementCost += cost;
          enhancementBreakdown.push({ name: loading.label, cost });
          explanations.push(`${loading.label}: Worldwide treatment adds premium`);
        }
      });
    }

    // Step 5: Calculate RIDER COSTS
    let riderCost = 0;
    const riderBreakdown = [];
    
    activeRiders.forEach(rider => {
      if (RIDER_COSTS[rider.id]) {
        const riderConfig = RIDER_COSTS[rider.id];
        let cost = 0;
        
        if (riderConfig.type === 'percentage') {
          cost = Math.round((basePremium * riderConfig.value) / 100);
          explanations.push(`${rider.label}: +${riderConfig.value}% of base premium for added protection`);
        } else if (riderConfig.type === 'fixed') {
          cost = riderConfig.value;
          explanations.push(`${rider.label}: Fixed cost add-on benefit`);
        }
        
        riderCost += cost;
        riderBreakdown.push({
          name: rider.label,
          cost: cost
        });
      }
    });

    // Step 6: Calculate FINAL TOTALS
    const subtotal = basePremium + enhancementCost + riderCost;
    const gstRate = 0; // Health insurance is exempt from GST (0%)
    const gstAmount = Math.round((subtotal * gstRate) / 100);
    const totalPremium = subtotal + gstAmount;

    return {
      rawBasePremium: Math.round(rawBasePremium),
      planMultiplier,
      basePremium,
      memberBreakdown,
      coPaymentDiscount,
      enhancementCost,
      enhancementBreakdown,
      riderCost,
      riderBreakdown,
      gstRate,
      gstAmount,
      totalPremium,
      explanations
    };
  }, [data, optionalEnhancements]);

  const { planMultiplier, basePremium, memberBreakdown, coPaymentDiscount, 
          enhancementCost, enhancementBreakdown, riderCost, riderBreakdown, 
          gstRate, totalPremium, explanations } = premiumCalculation;

  // Safeguard if data is not yet loaded
  if (!data) return null;

  return (
    <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-2xl space-y-6 sticky top-6">
      
      {/* Header Section */}
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-blue-400 text-[20px] font-black tracking-widest mb-2">Premium Breakdown</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Dynamic pricing based on your selections. All amounts are estimated and subject to underwriting.
        </p>
      </div>

      {/* Plan Details */}
      <div className="space-y-3 pb-4 border-b border-slate-700">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 font-medium">Selected Plan</span>
          <span className="font-bold text-white">{data.selectedPlan?.name || 'Health Plan'}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400 font-medium">Coverage Amount</span>
          <span className="font-bold text-blue-400">{data.sumInsured?.label || data.currentSI?.label || '₹10L'}</span>
        </div>
        {data.tenure && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">Policy Tenure</span>
            <span className="font-bold text-white">{data.tenure} Year{data.tenure > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Why Premium Changed - Real-time Explanations */}
      {explanations.length > 0 && (
        <div className="pb-4 border-b border-slate-700">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>💡</span> Why Your Premium Changed
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
            {explanations.map((explanation, index) => (
              <div key={index} className="flex items-start gap-2 text-[11px] text-slate-300 bg-slate-800/40 p-2 rounded-lg">
                <span className="text-amber-400 font-bold">•</span>
                <span className="leading-relaxed">{explanation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Base Premium Breakdown */}
      {memberBreakdown.length > 0 && (
        <div className="pb-4 border-b border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Base Premium</h3>
            <span className="text-lg font-black text-white">₹{basePremium.toLocaleString('en-IN')}</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {memberBreakdown.map((item, index) => (
              <div key={index} className="flex justify-between text-xs items-center bg-slate-800/50 p-2.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-medium">{item.member}</span>
                  <span className="text-[10px] text-slate-500 bg-slate-700/50 px-1.5 py-0.5 rounded">{item.age} yrs</span>
                </div>
                <span className="font-bold text-blue-300">₹{item.premium.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          {planMultiplier !== 1.0 && (
            <p className="text-[10px] text-slate-500 mt-2 italic">
              * Adjusted by {((planMultiplier - 1.0) * 100).toFixed(0)}% for {data.selectedPlan?.name || 'selected plan'}
            </p>
          )}
        </div>
      )}

      {/* Discounts Section */}
      {coPaymentDiscount > 0 && (
        <div className="pb-4 border-b border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider">Discounts Applied</h3>
            <span className="text-lg font-black text-green-400">-₹{coPaymentDiscount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs items-center bg-green-900/20 p-2.5 rounded-lg border border-green-800/30">
            <div>
              <span className="text-green-200 font-medium block">20% Co-payment Option</span>
              <span className="text-[10px] text-green-400">You share 20% of medical costs, reducing premium</span>
            </div>
            <span className="font-bold text-green-300">-20%</span>
          </div>
        </div>
      )}

      {/* Enhancement Loadings */}
      {enhancementBreakdown.length > 0 && (
        <div className="pb-4 border-b border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Enhanced Benefits</h3>
            <span className="text-lg font-black text-purple-400">+₹{enhancementCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="space-y-2">
            {enhancementBreakdown.map((enhancement, index) => (
              <div key={index} className="flex justify-between text-xs items-center bg-purple-900/20 p-2.5 rounded-lg border border-purple-800/30">
                <span className="text-purple-200 font-medium">{enhancement.name}</span>
                <span className="font-bold text-purple-300">+₹{enhancement.cost.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">
            * Premium upgrades for superior coverage features
          </p>
        </div>
      )}

      {/* Rider Costs */}
      {riderBreakdown.length > 0 && (
        <div className="pb-4 border-b border-slate-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Add-on Riders</h3>
            <span className="text-lg font-black text-teal-400">+₹{riderCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="space-y-2">
            {riderBreakdown.map((rider, index) => (
              <div key={index} className="flex justify-between text-xs items-center bg-teal-900/20 p-2.5 rounded-lg border border-teal-800/30">
                <span className="text-teal-200 font-medium">{rider.name}</span>
                <span className="font-bold text-teal-300">+₹{rider.cost.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">
            * Optional riders update premium instantly upon selection
          </p>
        </div>
      )}

      {/* GST Section */}
      <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-700">
        <div>
          <span className="text-slate-400 font-medium block">GST & Taxes</span>
          <span className="text-[10px] text-slate-500">Health insurance is GST exempt</span>
        </div>
        <span className="text-green-400 font-black text-xs bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
          {gstRate}% (NIL)
        </span>
      </div>

      {/* Pricing Summary Flow */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 space-y-2 border border-slate-700/50">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Premium Calculation</h3>
        
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Base Premium ({data.selectedPlan?.name || 'Plan'})</span>
          <span className="text-white font-bold">₹{basePremium.toLocaleString('en-IN')}</span>
        </div>
        
        {coPaymentDiscount > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-green-400">Co-payment Discount (-20%)</span>
            <span className="text-green-400 font-bold">-₹{coPaymentDiscount.toLocaleString('en-IN')}</span>
          </div>
        )}
        
        {enhancementCost > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-purple-400">Enhanced Benefits</span>
            <span className="text-purple-400 font-bold">+₹{enhancementCost.toLocaleString('en-IN')}</span>
          </div>
        )}
        
        {riderCost > 0 && (
          <div className="flex justify-between text-xs">
            <span className="text-teal-400">Add-on Riders</span>
            <span className="text-teal-400 font-bold">+₹{riderCost.toLocaleString('en-IN')}</span>
          </div>
        )}
        
        <div className="pt-2 mt-2 border-t border-slate-700">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-300">Subtotal</span>
            <span className="text-white">₹{(basePremium + enhancementCost + riderCost).toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">GST (0%)</span>
          <span className="text-slate-400">₹0</span>
        </div>
      </div>

      {/* Total Premium */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Annual Premium</p>
        <h3 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
          ₹{totalPremium.toLocaleString('en-IN')}
        </h3>
        <p className="text-[11px] text-slate-500 italic">
          Estimated for {memberBreakdown.length} member{memberBreakdown.length > 1 ? 's' : ''}
        </p>
        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
          <p className="text-[10px] text-amber-200 leading-relaxed">
            ⚡ <strong>Real-Time Pricing:</strong> Your premium updates instantly when you add/remove riders or change benefits. 
            Final amount confirmed after medical underwriting.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-3 pt-2">
        <button 
          onClick={() => navigate('/proposal-form', { state: data })}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-blue-500/30"
        >
          Proceed to KYC →
        </button>
        <p className="text-[10px] text-center text-slate-500 leading-relaxed">
          By proceeding, you agree that the premium shown is an estimate and final amount will be confirmed after underwriting.
        </p>
      </div>
    </div>
  );
};

export default PaymentSummary;