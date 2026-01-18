import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const AGE_ADJUSTMENT_TABLE = {
  'child': -40,       
  'adolescent': -25,  
  'base': 0,          
  '26-30': 10,        
  '31-35': 25,        
  '36-40': 40,        
  '41-45': 65,        
  '46-50': 90,        
  '51-55': 130,       
  '56-60': 180,       
  '61-65': 250,       
  '66-70': 350,       
  '71-75': 450,       
  '76-80': 600,       
  '81+': 800          
};

const PLAN_MULTIPLIERS = {
  'neev': 1.0,       // Neev uses direct premium lookup, multiplier not used
  'parivar': 1.0,    
  'varishtha': 1.3,  
  'vishwa': 1.8,     
  'vajra': 1.1       
};

// Neev Suraksha Premium Table (as per Neev_Premium.csv)
// Age groups: 0-35 (91 Days to 35 years), 36-50, 51-100
const NEEV_PREMIUM_TABLE = {
  '3L': { '0-35': 4500, '36-50': 5600, '51-100': 7800 },
  '4L': { '0-35': 6600, '36-50': 7700, '51-100': 9900 },
  '5L': { '0-35': 7500, '36-50': 8600, '51-100': 10800 }
};

// Helper to get Neev age bracket
const getNeevAgeBracket = (age) => {
  const a = parseFloat(age);
  if (isNaN(a)) return '0-35';
  if (a <= 35) return '0-35';
  if (a >= 36 && a <= 50) return '36-50';
  return '51-100';
};

// Get Neev premium directly from table
const getNeevPremium = (age, coverageKey) => {
  const ageBracket = getNeevAgeBracket(age);
  const validCoverageKeys = ['3L', '4L', '5L'];
  const effectiveKey = validCoverageKeys.includes(coverageKey) ? coverageKey : '5L';
  return NEEV_PREMIUM_TABLE[effectiveKey]?.[ageBracket] || NEEV_PREMIUM_TABLE['5L'][ageBracket];
};

const BASE_RATE_MATRIX = {
  '3L': 5500,
  '4L': 6500,
  '5L': 7500,
  '7L': 9000,
  '10L': 11500, 
  '15L': 14200,      
  '20L': 16500, 
  '25L': 18500,
  '50L': 22000, 
  '1Cr': 29500, 
  '2Cr': 35000, 
  '5Cr': 48000, 
  'Unlimited': 68000
};

const FEATURE_COSTS = {
  'global': { label: 'Global Coverage', cost: 6000 }, 
  'claim_cover': { label: '100% Claim Coverage', cost: 2500 },
  'maternity': { label: 'Maternity Cover', cost: 12000 },
  'non_deductible': { label: 'Non-Deductible Items', cost: 1500 },
  'auto_restore': { label: 'Automatic Restore Benefit', cost: 1800 },
  'air_amb': { label: 'Emergency Air Ambulance', cost: 1200 },
  'hospitalisation': { label: 'Hospitalisation Cover', cost: 4500 },
  'day_care': { label: 'Day Care Procedures', cost: 900 },
  'ayush': { label: 'AYUSH Benefits', cost: 600 },
  'organ_donor': { label: 'Organ Donor Expenses', cost: 800 },
  'domiciliary': { label: 'Domiciliary Expenses', cost: 900 },
  'no_sublimit': { label: 'No Sublimit on Medical Treatment', cost: 2200 }
};

const CHRONIC_BASE_FEE = 3500; 
const CHRONIC_CONDITIONS = {
  'diabetes': 1500,
  'high_cholesterol': 800,
  'copd': 1800,
  'heart_disease': 2500,
  'hypertension': 1000,
  'asthma': 1200
};

const RIDER_COSTS = {
  'unlimited_care': { label: 'Unlimited Care', cost: 4500 },
  'inflation_shield': { label: 'Inflation Shield', cost: 1800 },
  'tele_consult': { label: 'Tele-Consultation', cost: 999 },
  'smart_agg': { label: 'Smart Aggregate', cost: 2500 },
  'super_bonus': { label: 'Super Bonus (7x)', cost: 3200 },
  'ped_wait': { label: 'PED Wait Reduction', cost: 5500 }, 
  'specific_wait': { label: 'Specific Disease Wait', cost: 2100 },
  'maternity_boost': { label: 'Maternity Booster', cost: 8500 }
};

const GST_RATE = 0.00;

const getAgeAdjustmentPercent = (age) => {
  const a = parseFloat(age);
  if (isNaN(a)) return 0;
  if (a < 7.5) return -50; 
  if (a >= 7.5 && a <= 10) return AGE_ADJUSTMENT_TABLE['child'];
  if (a >= 11 && a <= 17) return AGE_ADJUSTMENT_TABLE['adolescent'];
  if (a >= 18 && a <= 25) return AGE_ADJUSTMENT_TABLE['base'];
  if (a >= 26 && a <= 30) return AGE_ADJUSTMENT_TABLE['26-30'];
  if (a >= 31 && a <= 35) return AGE_ADJUSTMENT_TABLE['31-35'];
  if (a >= 36 && a <= 40) return AGE_ADJUSTMENT_TABLE['36-40'];
  if (a >= 41 && a <= 45) return AGE_ADJUSTMENT_TABLE['41-45'];
  if (a >= 46 && a <= 50) return AGE_ADJUSTMENT_TABLE['46-50'];
  if (a >= 51 && a <= 55) return AGE_ADJUSTMENT_TABLE['51-55'];
  if (a >= 56 && a <= 60) return AGE_ADJUSTMENT_TABLE['56-60'];
  if (a >= 61 && a <= 65) return AGE_ADJUSTMENT_TABLE['61-65'];
  if (a >= 66 && a <= 70) return AGE_ADJUSTMENT_TABLE['66-70'];
  if (a >= 71 && a <= 75) return AGE_ADJUSTMENT_TABLE['71-75'];
  if (a >= 76 && a <= 80) return AGE_ADJUSTMENT_TABLE['76-80'];
  if (a >= 81) return AGE_ADJUSTMENT_TABLE['81+'];
  return 0;
};

const getCoverageKey = (si) => {
  if (!si) return '10L'; 
  
  let checkStr = (typeof si === 'object' ? (si.label || si.value || '') : si.toString());
  checkStr = checkStr.toLowerCase().replace(/\s/g, ''); 

  if (checkStr.includes('3l')) return '3L';
  if (checkStr.includes('4l')) return '4L';
  if (checkStr.includes('5l') && !checkStr.includes('25') && !checkStr.includes('50')) return '5L';
  if (checkStr.includes('7l')) return '7L';
  if (checkStr.includes('10l')) return '10L';
  if (checkStr.includes('15l')) return '15L';
  if (checkStr.includes('20l')) return '20L';
  if (checkStr.includes('25l')) return '25L';
  if (checkStr.includes('50l')) return '50L';
  if (checkStr.includes('1cr')) return '1Cr';
  if (checkStr.includes('2cr')) return '2Cr';
  if (checkStr.includes('5cr')) return '5Cr';
  if (checkStr.includes('unlimited')) return 'Unlimited';
  
  return '10L'; 
};

const normalizeId = (id) => String(id || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const PaymentSummary = ({ data }) => {
  const navigate = useNavigate();

  const calculations = useMemo(() => {
    if (!data) return null;

    const { 
      memberAges = {}, 
      counts = {}, 
      sumInsured, 
      currentSI,
      riders = [],
      features = [],
      selectedChronic = [],
      tenure = 1,
      coPayment = false,
      selectedPlan = {},
      roomRentLimit,
      isRoomRentCapped, 
      optionalEnhancements = {}
    } = data;

    let planMultiplier = 1.0;
    const planNameRaw = (selectedPlan.name || 'Parivar').toLowerCase();
    const isNeevPlan = planNameRaw.includes('neev');
    
    if (planNameRaw.includes('neev')) planMultiplier = PLAN_MULTIPLIERS.neev;
    else if (planNameRaw.includes('vishwa')) planMultiplier = PLAN_MULTIPLIERS.vishwa;
    else if (planNameRaw.includes('varishtha')) planMultiplier = PLAN_MULTIPLIERS.varishtha;
    else if (planNameRaw.includes('vajra') || selectedPlan.isCustom) planMultiplier = PLAN_MULTIPLIERS.vajra;
    else planMultiplier = PLAN_MULTIPLIERS.parivar; 

    const effectiveSI = sumInsured || currentSI;
    const coverageKey = getCoverageKey(effectiveSI);
    const baseRatePerAdult = BASE_RATE_MATRIX[coverageKey] || BASE_RATE_MATRIX['10L'];
    
    let totalBasePremium = 0;
    const memberBreakdown = [];
    const explanationLines = [];

    Object.keys(counts).forEach(memberType => {
      const count = counts[memberType];
      if (count > 0) {
        const ages = Array.isArray(memberAges[memberType]) ? memberAges[memberType] : [memberAges[memberType]];
        
        ages.forEach((age, idx) => {
          if (!age) return;
          
          let adjustedPremium;
          
          // Use Neev-specific premium table for Neev plan
          if (isNeevPlan) {
            adjustedPremium = getNeevPremium(age, coverageKey);
          } else {
            const adjustmentPercent = getAgeAdjustmentPercent(age);
            adjustedPremium = Math.round(baseRatePerAdult * (1 + (adjustmentPercent / 100)));
            adjustedPremium = Math.round(adjustedPremium * planMultiplier);
          }

          totalBasePremium += adjustedPremium;

          memberBreakdown.push({
            label: `${memberType.charAt(0).toUpperCase() + memberType.slice(1).replace('_', ' ')} ${idx + 1}`,
            age: age,
            base: isNeevPlan ? adjustedPremium : baseRatePerAdult,
            adjustment: isNeevPlan ? 0 : getAgeAdjustmentPercent(age),
            final: adjustedPremium
          });
        });
      }
    });

    let featureCost = 0;
    let riderCost = 0;
    
    const allAddons = [...(features || []), ...(riders || [])];
    
    allAddons.forEach(item => {
      const isActive = typeof item === 'string' ? true : (item.active === true || item.selected === true);
      const itemId = typeof item === 'string' ? item : (item.id || item.name);
      
      if (isActive) {
        const nId = normalizeId(itemId);
        
        const fKey = Object.keys(FEATURE_COSTS).find(k => normalizeId(k) === nId);
        if (fKey) {
          featureCost += FEATURE_COSTS[fKey].cost;
          explanationLines.push(`${FEATURE_COSTS[fKey].label}: +₹${FEATURE_COSTS[fKey].cost}`);
        }
        
        const rKey = Object.keys(RIDER_COSTS).find(k => normalizeId(k) === nId);
        if (rKey) {
          riderCost += RIDER_COSTS[rKey].cost;
          explanationLines.push(`${RIDER_COSTS[rKey].label}: +₹${RIDER_COSTS[rKey].cost}`);
        }
      }
    });

    let chronicCost = 0;
    if (selectedChronic && selectedChronic.length > 0) {
      chronicCost += CHRONIC_BASE_FEE;
      selectedChronic.forEach(conditionId => {
        const cKey = Object.keys(CHRONIC_CONDITIONS).find(k => normalizeId(k) === normalizeId(conditionId));
        const cost = cKey ? CHRONIC_CONDITIONS[cKey] : 1000;
        chronicCost += cost;
      });
      explanationLines.push(`Chronic Management: +₹${chronicCost}`);
    }

    let discountAmount = 0;
    const subTotal = totalBasePremium + featureCost + chronicCost;

    if (tenure === 2) discountAmount += Math.round(totalBasePremium * 0.05);
    if (tenure === 3) discountAmount += Math.round(totalBasePremium * 0.10);

    if (coPayment) {
      discountAmount += Math.round(subTotal * 0.20);
    }

    const isRoomRentRestricted = roomRentLimit === true || 
                                 isRoomRentCapped === true || 
                                 optionalEnhancements?.roomRentRestriction === true;

    if (isRoomRentRestricted) {
      const roomDiscount = Math.round(subTotal * 0.10);
      discountAmount += roomDiscount;
      explanationLines.push(`Room Rent Limit: -₹${roomDiscount}`);
    }

    const netPremium = (totalBasePremium + featureCost + chronicCost + riderCost) - discountAmount;
    const gstAmount = Math.round(netPremium * GST_RATE);
    
    const finalAnnualPremium = netPremium + gstAmount;
    const totalPayable = finalAnnualPremium * tenure; 

    return {
      totalBasePremium,
      memberBreakdown,
      featureCost,
      chronicCost,
      riderCost,
      discountAmount,
      netPremium,
      gstAmount,
      finalAnnualPremium,
      totalPayable,
      explanationLines,
      planName: selectedPlan.name,
      coverageDisplay: coverageKey
    };

  }, [data]);

  if (!data || !calculations) return null;

  const { 
    totalBasePremium, memberBreakdown, featureCost, chronicCost, riderCost, 
    discountAmount, gstAmount, totalPayable, planName, coverageDisplay 
  } = calculations;

  return (
    <div className="bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-2xl space-y-6 sticky top-6">
      <div className="border-b border-slate-700 pb-4">
        <h2 className="text-blue-400 text-[20px] font-black tracking-widest mb-1">PREMIUM BREAKDOWN</h2>
        <div className="flex justify-between items-end">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            {planName || 'Plan'} • {coverageDisplay} Coverage
          </p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center group cursor-help relative">
          <span className="text-slate-300 border-b border-dashed border-slate-600">
            Base Premium ({memberBreakdown.length} Members)
          </span>
          <span className="font-bold">₹{totalBasePremium.toLocaleString('en-IN')}</span>
          
          <div className="absolute left-0 bottom-6 w-72 bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            <p className="text-xs font-bold text-blue-300 mb-2 border-b border-slate-600 pb-2">Member Breakdown</p>
            {memberBreakdown.map((m, i) => (
              <div key={i} className="flex justify-between text-[11px] text-slate-300 mb-1.5">
                <span>{m.label} ({m.age}y)</span>
                <span className="font-mono">₹{m.final.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {featureCost > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-slate-300">Features</span>
            <span className="font-bold">₹{featureCost.toLocaleString('en-IN')}</span>
          </div>
        )}

        {chronicCost > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-orange-400 font-medium">Chronic Loading</span>
            <span className="font-bold text-orange-400">₹{chronicCost.toLocaleString('en-IN')}</span>
          </div>
        )}

        {riderCost > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-purple-300 font-medium">Riders</span>
            <span className="font-bold text-purple-300">₹{riderCost.toLocaleString('en-IN')}</span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-green-400">Discounts</span>
            <span className="font-bold text-green-400">-₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="border-t border-slate-700 my-2"></div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Net Premium</span>
          <span className="font-medium">₹{(totalBasePremium + featureCost + chronicCost + riderCost - discountAmount).toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">GST (0%)</span>
          <span className="font-medium text-slate-500 line-through decoration-slate-500">Exempt</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50"></div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
        <h3 className="text-4xl font-black text-white tracking-tighter">
          ₹{totalPayable.toLocaleString('en-IN')}
        </h3>
        {data.tenure > 1 && (
          <p className="text-xs text-blue-400 mt-1 font-medium">
            {data.tenure} Year Plan
          </p>
        )}
      </div>

      <div className="pt-2">
        <button 
          onClick={() => navigate('/kyc', { state: { ...data, paymentDetails: calculations } })}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-900/40 transform active:scale-[0.98]"
        >
          Proceed to KYC &rarr;
        </button>
      </div>
    </div>
  );
};

export default PaymentSummary;