const mongoose = require("mongoose");
const InsurancePlan = require("../models/InsurancePlan");
const PlanCustomization = require("../models/PlanCustomization");

const ROOM_RENT_SURCHARGE_MAP = {
  fixed: 0,
  percent_sum_insured: 0.05,
  single_private_ac: 0.08,
  deluxe: 0.12,
  any_room: 0.15,
};

// Parivar Suraksha Maternity Limits based on Sum Insured (from CSV)
// ₹75k for 10L & 15L, ₹1L for 20L & 25L, ₹2L for 50L & 1Cr
const PARIVAR_MATERNITY_LIMITS = {
  '10L': 75000,
  '15L': 75000,
  '20L': 100000,
  '25L': 100000,
  '50L': 200000,
  '1Cr': 200000
};

// Parivar Suraksha Premium Table (from CSV)
const PARIVAR_PREMIUM_TABLE = {
  '10L': { '18-25': 8500, '26-35': 10662, '36-40': 13374, '41-45': 14979, '46-50': 16777, '51-55': 18790, '56-60': 21045, '61-65': 23571, '66-70': 26399, '71-75': 29567, '76-100': 34002 },
  '15L': { '18-25': 10625, '26-35': 13327, '36-40': 16717, '41-45': 18723, '46-50': 20971, '51-55': 23487, '56-60': 26306, '61-65': 29463, '66-70': 32998, '71-75': 36958, '76-100': 42502 },
  '20L': { '18-25': 12750, '26-35': 15993, '36-40': 20061, '41-45': 22468, '46-50': 25165, '51-55': 28185, '56-60': 31567, '61-65': 35356, '66-70': 39598, '71-75': 44350, '76-100': 51003 },
  '25L': { '18-25': 14875, '26-35': 18658, '36-40': 23404, '41-45': 26213, '46-50': 29359, '51-55': 32882, '56-60': 36828, '61-65': 41249, '66-70': 46198, '71-75': 51742, '76-100': 59503 },
  '50L': { '18-25': 21250, '26-35': 26655, '36-40': 33435, '41-45': 37447, '46-50': 41942, '51-55': 46975, '56-60': 52612, '61-65': 58927, '66-70': 65997, '71-75': 73917, '76-100': 85005 },
  '1Cr': { '18-25': 29750, '26-35': 37317, '36-40': 46809, '41-45': 52426, '46-50': 58719, '51-55': 65765, '56-60': 73657, '61-65': 82498, '66-70': 92396, '71-75': 103484, '76-100': 119007 }
};

// Air Ambulance Rider cost (from CSV)
const AIR_AMBULANCE_RIDER_COST = 250;

// Get maternity limit for Parivar Suraksha plan based on sum insured
const getMaternityLimit = (sumInsured) => {
  if (!sumInsured) return 75000; // Default
  const si = Number(sumInsured);
  
  if (si <= 1000000) return 75000;     // 10L
  if (si <= 1500000) return 75000;     // 15L
  if (si <= 2000000) return 100000;    // 20L
  if (si <= 2500000) return 100000;    // 25L
  if (si <= 5000000) return 200000;    // 50L
  return 200000;                        // 1Cr and above
};

// Check if maternity coverage is eligible (requires self AND spouse)
const isMaternityEligible = (memberCounts = {}) => {
  const hasSelf = Number(memberCounts.self || 0) > 0;
  const hasSpouse = Number(memberCounts.spouse || 0) > 0;
  return hasSelf && hasSpouse;
};

// Check if plan is Parivar plan
const isParivarPlan = (plan) => {
  const planName = (plan.planName || plan.code || '').toLowerCase();
  return planName.includes('parivar');
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

// Get coverage key from sum insured value
const getCoverageKey = (sumInsured) => {
  if (!sumInsured) return '5L';
  const si = Number(sumInsured);
  if (si <= 300000) return '3L';
  if (si <= 400000) return '4L';
  if (si <= 500000) return '5L';
  return '5L'; // Default to 5L for Neev plan
};

// Get Neev premium directly from table
const getNeevPremium = (age, sumInsured, premiumTable = null) => {
  const table = premiumTable || NEEV_PREMIUM_TABLE;
  const ageBracket = getNeevAgeBracket(age);
  const coverageKey = getCoverageKey(sumInsured);
  return table[coverageKey]?.[ageBracket] || table['5L']?.[ageBracket] || 7500;
};

// Check if plan is Neev plan
const isNeevPlan = (plan) => {
  const planName = (plan.planName || plan.code || '').toLowerCase();
  return planName.includes('neev') || plan.usesAgePremiumTable === true;
};

const calculatePremium = async ({
  planId,
  addOnIds = [],
  roomRentSelection,
  coPayment,
  waitingPeriodReductionDays = 0,
  memberAge = null,        // Single member age
  memberAges = [],         // Array of member ages for family plans
  sumInsuredValue = null,  // Sum insured value (e.g., 300000, 400000, 500000)
}) => {
  if (!mongoose.Types.ObjectId.isValid(planId)) {
    return { error: "Invalid planId" };
  }

  const plan = await InsurancePlan.findById(planId);
  if (!plan || !plan.isActive) {
    return { error: "Plan not found" };
  }

  const addOns = addOnIds.length
    ? await PlanCustomization.find({
        _id: { $in: addOnIds },
        isActive: true,
        applicablePlans: plan._id,
      })
    : [];

  const addOnTotal = addOns.reduce(
    (sum, item) => sum + (item.priceImpact || 0),
    0
  );

  // Calculate base premium - use age-based table for Neev plan
  let basePremium = plan.basePremium;
  let memberBreakdown = [];
  const effectiveSumInsured = sumInsuredValue || plan.sumInsured;

  if (isNeevPlan(plan)) {
    // Use Neev premium table for age-based calculation
    const premiumTable = plan.premiumTable || NEEV_PREMIUM_TABLE;
    
    // Handle multiple members
    const ages = memberAges.length > 0 ? memberAges : (memberAge ? [memberAge] : []);
    
    if (ages.length > 0) {
      basePremium = 0;
      ages.forEach((age, idx) => {
        const agePremium = getNeevPremium(age, effectiveSumInsured, premiumTable);
        basePremium += agePremium;
        memberBreakdown.push({
          memberIndex: idx + 1,
          age: age,
          ageBracket: getNeevAgeBracket(age),
          coverageKey: getCoverageKey(effectiveSumInsured),
          premium: agePremium
        });
      });
    } else {
      // Default to middle age bracket if no age provided
      basePremium = getNeevPremium(30, effectiveSumInsured, premiumTable);
    }
  }

  let roomRentAdjustment = 0;
  if (roomRentSelection) {
    const selectionType =
      typeof roomRentSelection === "string"
        ? roomRentSelection
        : roomRentSelection.type;
    const selectionValue =
      typeof roomRentSelection === "object"
        ? roomRentSelection.value
        : undefined;

    if (selectionType === "fixed" && selectionValue !== undefined) {
      if (selectionValue > (plan.roomRentLimit?.value || 0)) {
        roomRentAdjustment = basePremium * 0.03;
      }
    } else if (selectionType && selectionType !== plan.roomRentLimit?.type) {
      roomRentAdjustment = basePremium * (ROOM_RENT_SURCHARGE_MAP[selectionType] || 0);
    }
  }

  let coPaymentAdjustment = 0;
  const effectiveCoPay = coPayment || plan.coPayment;
  if (effectiveCoPay?.type === "percent" && effectiveCoPay.value) {
    coPaymentAdjustment = -basePremium * (effectiveCoPay.value / 100);
  }
  if (effectiveCoPay?.type === "fixed" && effectiveCoPay.value) {
    coPaymentAdjustment = -effectiveCoPay.value;
  }

  const reductionDays = Math.max(0, Number(waitingPeriodReductionDays) || 0);
  const waitingPeriodAdjustment = reductionDays
    ? basePremium * (Math.min(reductionDays, 365) / 30) * 0.02
    : 0;

  const finalPremium =
    basePremium +
    addOnTotal +
    roomRentAdjustment +
    coPaymentAdjustment +
    waitingPeriodAdjustment;

  return {
    plan,
    addOns,
    basePremium,
    memberBreakdown,
    isAgeBased: isNeevPlan(plan),
    addOnTotal,
    roomRentAdjustment,
    coPaymentAdjustment,
    waitingPeriodAdjustment,
    finalPremium,
  };
};

module.exports = { calculatePremium };
