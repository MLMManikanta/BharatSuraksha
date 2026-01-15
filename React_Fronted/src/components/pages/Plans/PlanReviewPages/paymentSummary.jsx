import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PAYMENT SUMMARY - COMPREHENSIVE PREMIUM CALCULATION ENGINE
 * 
 * CALCULATION METHODOLOGY:
 * ═══════════════════════════════════════════════════════════
 * 
 * 1. BASE PREMIUM (Plan-Specific)
 *    ├─ Standard Plans: Use basePremium from PlanPreExistingSelection
 *    │  • Neev: Age-based rates + ₹3,000 uplift
 *    │  • Parivar: Age-based rates + ₹4,000 uplift  
 *    │  • Varishtha: Senior rates (60+ only) + reduced rates
 *    │  • Vishwa: Age-based rates + ₹6,000 uplift
 *    └─ Vajra (Custom): Age-based rates × 1.2 multiplier
 * 
 * 2. AGE-BASED LOADING
 *    ├─ Reference Age: 18-25 years (0% loading)
 *    ├─ Child (7.5-17 years): 5-10% loading
 *    ├─ Adult (26-60 years): 10-50% loading  
 *    ├─ Senior (61-75 years): 75-120% loading
 *    └─ Elderly (76-100 years): 150-200% loading
 *    Note: Age loading is calculated as percentage increase over base
 * 
 * 3. COMPONENT-WISE FEATURE PRICING (₹ Fixed)
 *    ├─ Global Coverage: +₹8,000
 *    ├─ Maternity Cover: +₹5,000
 *    ├─ Air Ambulance: +₹5,000
 *    ├─ Restore Benefit: +₹4,000
 *    ├─ AYUSH Benefits: +₹2,000
 *    └─ Day Care Procedures: +₹3,000
 * 
 * 4. CHRONIC CARE (Day 31+)
 *    └─ Per condition: +₹1,500 each
 * 
 * 5. PREMIUM RIDERS
 *    ├─ Percentage-based: % of (Base + Age Loading)
 *    │  • Unlimited Care: +15%
 *    │  • Inflation Shield: +12%
 *    │  • Smart Aggregate: +8%
 *    │  • Super Bonus: +10%
 *    │  • PED Wait Reduction: +18%
 *    └─ Fixed-cost:
 *       • Tele-Consultation: +₹1,500
 *       • Maternity Booster: +₹3,500
 * 
 * 6. DISCOUNTS (Applied Post Age Loading)
 *    ├─ Co-payment (20%): -20% on total before riders
 *    ├─ Room Rent Restriction: -8%
 *    └─ Extended Wait Period: -5%
 * 
 * 7. GST & TAXES
 *    └─ Health Insurance: 0% (GST Exempt)
 * 
 * 8. FINAL PREMIUM
 *    Total = Base + Age Loading + Features + Chronic + Riders - Discounts + GST
 * 
 * ═══════════════════════════════════════════════════════════
 * MANDATORY DISCLAIMER:
 * "All premiums shown are estimated and indicative. Final premium 
 * may increase or decrease based on underwriting, age, coverage 
 * selection, and policy terms."
 * ═══════════════════════════════════════════════════════════
 */

// Age-based loading percentages (increase over base premium)
// Base reference: 18-25 years = 0% loading
const AGE_LOADING_TABLE = {
  '0.625-7': 8,      // 7.5 months - 7 years: +8%
  '7-17': 10,       // 7-17 years: +10%
  '18-25': 0,       // Base reference: 0%
  '26-30': 12,      // 26-30 years: +12%
  '31-35': 18,      // 31-35 years: +18%
  '36-40': 25,      // 36-40 years: +25%
  '41-45': 32,      // 41-45 years: +32%
  '46-50': 40,      // 46-50 years: +40%
  '51-55': 55,      // 51-55 years: +55%
  '56-60': 70,      // 56-60 years: +70%
  '61-65': 90,      // 61-65 years: +90%
  '66-70': 115,     // 66-70 years: +115%
  '71-75': 145,     // 71-75 years: +145%
  '76-80': 175,     // 76-80 years: +175%
  '81-100': 200     // 81-100 years: +200%
};

// Component-wise feature pricing (fixed ₹ amounts)
const FEATURE_COSTS = {
  'global': { label: 'Global Coverage', cost: 8000 },
  'maternity_global': { label: 'Maternity Cover', cost: 5000 },
  'air_amb': { label: 'Air Ambulance', cost: 5000 },
  'restore': { label: 'Restore Benefit', cost: 4000 },
  'ayush': { label: 'AYUSH Benefits', cost: 2000 },
  'day_care': { label: 'Day Care Procedures', cost: 3000 },
  'organ': { label: 'Organ Donor Expenses', cost: 2500 },
  'domiciliary': { label: 'Domiciliary Expenses', cost: 1800 }
};

// Chronic care pricing (per condition)
const CHRONIC_CARE_COST_PER_CONDITION = 1500;

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
// Note: Neev, Parivar, Vishwa receive flat uplifts in PlanPreExistingSelection
const PLAN_MULTIPLIERS = {
  'Neev Suraksha': 1.0,         // Basic plan - gets ₹3k uplift in handler
  'Parivar Suraksha': 1.0,      // Family plan - gets ₹4k uplift in handler
  'Varishtha Suraksha': 1.0,    // Senior plan - gets age-specific rates, no multiplier
  'Vishwa Suraksha': 1.0,       // Comprehensive global - gets ₹6k uplift in handler
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

const getAgeLoadingPercentage = (age) => {
  const ageNum = parseFloat(age);
  if (ageNum >= 0.625 && ageNum < 7) return AGE_LOADING_TABLE['0.625-7'];
  if (ageNum >= 7 && ageNum < 18) return AGE_LOADING_TABLE['7-17'];
  if (ageNum >= 18 && ageNum <= 25) return AGE_LOADING_TABLE['18-25'];
  if (ageNum >= 26 && ageNum <= 30) return AGE_LOADING_TABLE['26-30'];
  if (ageNum >= 31 && ageNum <= 35) return AGE_LOADING_TABLE['31-35'];
  if (ageNum >= 36 && ageNum <= 40) return AGE_LOADING_TABLE['36-40'];
  if (ageNum >= 41 && ageNum <= 45) return AGE_LOADING_TABLE['41-45'];
  if (ageNum >= 46 && ageNum <= 50) return AGE_LOADING_TABLE['46-50'];
  if (ageNum >= 51 && ageNum <= 55) return AGE_LOADING_TABLE['51-55'];
  if (ageNum >= 56 && ageNum <= 60) return AGE_LOADING_TABLE['56-60'];
  if (ageNum >= 61 && ageNum <= 65) return AGE_LOADING_TABLE['61-65'];
  if (ageNum >= 66 && ageNum <= 70) return AGE_LOADING_TABLE['66-70'];
  if (ageNum >= 71 && ageNum <= 75) return AGE_LOADING_TABLE['71-75'];
  if (ageNum >= 76 && ageNum <= 80) return AGE_LOADING_TABLE['76-80'];
  if (ageNum >= 81 && ageNum <= 100) return AGE_LOADING_TABLE['81-100'];
  return 0; // Default 0% for unknown ages
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
  
  // Calculate total premium based on member ages and riders
  const premiumCalculation = useMemo(() => {
    const optionalEnhancements = data?.optionalEnhancements || {
      coPayment: false,
      roomRentRestriction: false,
      extendedWaitPeriod: false
    };

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
    let planMultiplier = 1.0;
    let ageLoadingAmount = 0;
    let ageLoadingPercentage = 0;
    const memberBreakdown = [];

    // STEP 1: Calculate Base Premium
    if (!isCustomPlan && data.basePremium) {
      // Standard plans use pre-calculated base from PlanPreExistingSelection
      basePremium = data.basePremium;
      explanations.push(`${planName}: Base premium calculated from member ages and ${sumInsured?.label || 'coverage'} sum insured`);
      
      // Calculate average age loading for display
      let totalAgeLoading = 0;
      let memberCount = 0;
      Object.keys(memberCounts).forEach(memberId => {
        const count = memberCounts[memberId];
        if (count > 0) {
          const ages = Array.isArray(memberAges[memberId]) ? memberAges[memberId] : [memberAges[memberId]];
          ages.forEach(age => {
            if (age) {
              totalAgeLoading += getAgeLoadingPercentage(age);
              memberCount++;
            }
          });
        }
      });
      if (memberCount > 0) {
        ageLoadingPercentage = Math.round(totalAgeLoading / memberCount);
        ageLoadingAmount = Math.round((basePremium * ageLoadingPercentage) / (100 + ageLoadingPercentage));
        explanations.push(`Age-based loading: Average ${ageLoadingPercentage}% increase for member age profile`);
      }
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

      // Calculate average age loading percentage
      let totalAgeLoading = 0;
      let memberCount = memberBreakdown.length;
      memberBreakdown.forEach(m => {
        const loading = getAgeLoadingPercentage(m.age);
        totalAgeLoading += loading;
        m.ageLoading = loading;
      });
      
      if (memberCount > 0) {
        ageLoadingPercentage = Math.round(totalAgeLoading / memberCount);
      }

      // Apply age loading to base premium
      ageLoadingAmount = Math.round((rawBasePremium * ageLoadingPercentage) / 100);
      
      // Apply PLAN-SPECIFIC MULTIPLIER (Vajra only)
      planMultiplier = PLAN_MULTIPLIERS[planName] || 1.0;
      basePremium = Math.round((rawBasePremium + ageLoadingAmount) * planMultiplier);
      
      if (planMultiplier !== 1.0) {
        const percentage = Math.abs((planMultiplier - 1.0) * 100).toFixed(0);
        explanations.push(`${planName}: ${percentage}% premium for customization flexibility`);
      }
      
      if (ageLoadingPercentage > 0) {
        explanations.push(`Age-based loading: +${ageLoadingPercentage}% (₹${ageLoadingAmount.toLocaleString('en-IN')}) based on member ages`);
      }

      // Update member breakdown
      memberBreakdown.forEach(m => {
        m.premium = Math.round((m.premium + (m.premium * m.ageLoading / 100)) * planMultiplier);
      });
    }

    // STEP 2: Calculate Component-wise Feature Costs (VAJRA/Custom only)
    let featureCost = 0;
    const featureBreakdown = [];
    
    if (isCustomPlan) {
      activeFeatures.forEach(feature => {
        if (FEATURE_COSTS[feature.id]) {
          const featureConfig = FEATURE_COSTS[feature.id];
          featureCost += featureConfig.cost;
          featureBreakdown.push({
            name: featureConfig.label,
            cost: featureConfig.cost
          });
          explanations.push(`${featureConfig.label}: +₹${featureConfig.cost.toLocaleString('en-IN')} component cost`);
        }
      });
    }

    // STEP 3: Calculate Chronic Care Costs (Day 31+)
    let chronicCareCost = 0;
    const selectedChronic = data.selectedChronic || [];
    if (selectedChronic.length > 0) {
      chronicCareCost = selectedChronic.length * CHRONIC_CARE_COST_PER_CONDITION;
      explanations.push(`Chronic Care: ${selectedChronic.length} conditions × ₹${CHRONIC_CARE_COST_PER_CONDITION.toLocaleString('en-IN')} = ₹${chronicCareCost.toLocaleString('en-IN')}`);
    }

    // STEP 4: Apply Discounts (after age loading, before riders)
    let totalDiscounts = 0;
    const discountBreakdown = [];
    
    // Co-payment discount (20%)
    if (optionalEnhancements.coPayment || data.coPayment === true) {
      const beforeDiscounts = basePremium + featureCost + chronicCareCost;
      const coPayDiscount = Math.round(beforeDiscounts * 0.20);
      totalDiscounts += coPayDiscount;
      discountBreakdown.push({ name: 'Co-payment (20% cost sharing)', amount: coPayDiscount });
      explanations.push(`Co-payment discount: -₹${coPayDiscount.toLocaleString('en-IN')} (you share 20% of medical costs)`);
    }
    
    // Room rent restriction discount (8%)
    if (optionalEnhancements.roomRentRestriction) {
      const roomDiscount = Math.round((basePremium + featureCost + chronicCareCost) * 0.08);
      totalDiscounts += roomDiscount;
      discountBreakdown.push({ name: 'Room Rent Restriction', amount: roomDiscount });
      explanations.push(`Room rent restriction: -₹${roomDiscount.toLocaleString('en-IN')} (8% discount)`);
    }
    
    // Extended waiting period discount (5%)
    if (optionalEnhancements.extendedWaitPeriod) {
      const waitDiscount = Math.round((basePremium + featureCost + chronicCareCost) * 0.05);
      totalDiscounts += waitDiscount;
      discountBreakdown.push({ name: 'Extended Waiting Period', amount: waitDiscount });
      explanations.push(`Extended waiting period: -₹${waitDiscount.toLocaleString('en-IN')} (5% discount)`);
    }

    // STEP 5: Calculate RIDER COSTS (percentage of base+age loading, applied after discounts)
    let riderCost = 0;
    const riderBreakdown = [];
    const baseForRiders = basePremium; // Riders calculated on base including age loading
    
    activeRiders.forEach(rider => {
      if (RIDER_COSTS[rider.id]) {
        const riderConfig = RIDER_COSTS[rider.id];
        let cost = 0;
        
        if (riderConfig.type === 'percentage') {
          cost = Math.round((baseForRiders * riderConfig.value) / 100);
          explanations.push(`${rider.label}: +${riderConfig.value}% of base = ₹${cost.toLocaleString('en-IN')}`);
        } else if (riderConfig.type === 'fixed') {
          cost = riderConfig.value;
          explanations.push(`${rider.label}: Fixed ₹${cost.toLocaleString('en-IN')} add-on`);
        }
        
        riderCost += cost;
        riderBreakdown.push({
          name: rider.label,
          cost: cost
        });
      }
    });

    // STEP 6: Calculate FINAL TOTALS
    const subtotal = basePremium + featureCost + chronicCareCost + riderCost - totalDiscounts;
    const gstRate = 0; // Health insurance is GST exempt (0%)
    const gstAmount = 0;
    const totalPremium = subtotal + gstAmount;
    const tenureYears = Number(data.tenure || 1);
    const payableAmount = Math.max(0, Math.round(totalPremium * tenureYears));

    return {
      rawBasePremium: Math.round(rawBasePremium),
      basePremium,
      ageLoadingAmount,
      ageLoadingPercentage,
      planMultiplier,
      memberBreakdown,
      featureCost,
      featureBreakdown,
      chronicCareCost,
      selectedChronic,
      totalDiscounts,
      discountBreakdown,
      riderCost,
      riderBreakdown,
      subtotal,
      gstRate,
      gstAmount,
      totalPremium,
      tenureYears,
      payableAmount,
      explanations
    };
  }, [data]);

  const { tenureYears, payableAmount, totalPremium } = premiumCalculation;

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

      {/* Consolidated Payable Amount */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border border-slate-700/50 text-center">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Payable</p>
        <h3 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-2">
          ₹{payableAmount.toLocaleString('en-IN')}
        </h3>
        <p className="text-xs text-slate-400">
          {tenureYears} Year{tenureYears > 1 ? 's' : ''} • ₹{totalPremium.toLocaleString('en-IN')} per year
        </p>
      </div>

      {/* Action Button */}
      <div className="space-y-3 pt-2">
        <button 
          onClick={() => navigate('/kyc', { state: data })}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-blue-500/30"
        >
          Proceed to KYC →
        </button>
        <p className="text-[10px] text-center text-slate-500 leading-relaxed">
          By proceeding, you acknowledge that all premiums are estimates. Final premium will be determined 
          after complete underwriting, medical assessment, age verification, and policy issuance.
        </p>
      </div>
    </div>
  );
};

export default PaymentSummary;