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
