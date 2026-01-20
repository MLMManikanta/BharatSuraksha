/**
 * VAJRA Premium Service
 * Handles VAJRA Suraksha premium calculation requests
 */
const {
  VAJRA_AGE_MULTIPLIERS,
  VAJRA_FEATURE_COSTS_BASE,
  VAJRA_CHRONIC_COSTS_BASE,
  VAJRA_RIDER_COSTS_BASE,
  getVajraAgeBracket,
  getVajraCoverageKey,
  getVajraFeatureCost,
  getVajraChronicCost,
  getVajraRiderCost,
  calculateVajraPremium
} = require('../utils/vajraPremiumCalculator');

/**
 * Calculate VAJRA premium for given configuration
 * @param {Object} config - Configuration object with coverage, ages, features, riders, etc.
 * @returns {Object} Calculated premium with breakdown
 */
const calculatePremium = async (config) => {
  const {
    coverageKey,
    sumInsured,
    ages = [],
    members = [],
    preHosp = 60,
    postHosp = 90,
    features = [],
    riders = [],
    chronicConditions = [],
    tenure = 1
  } = config;

  // Extract ages from members if not provided directly
  const effectiveAges = ages.length > 0 
    ? ages 
    : members.map(m => m.age || 30);

  // Determine coverage key
  const effectiveCoverageKey = coverageKey || getVajraCoverageKey(sumInsured);

  // Calculate premium using the utility function
  const result = calculateVajraPremium({
    coverageKey: effectiveCoverageKey,
    ages: effectiveAges,
    preHosp,
    postHosp,
    features,
    riders,
    chronicConditions,
    tenure
  });

  return result;
};

/**
 * Get available features with costs for given coverage and age
 */
const getFeatureCosts = async (coverageKey, age = 30) => {
  const features = [];
  
  for (const [featureId, costs] of Object.entries(VAJRA_FEATURE_COSTS_BASE)) {
    const baseCost = costs[coverageKey] || costs['10L'];
    const ageBracket = getVajraAgeBracket(age);
    const multiplier = VAJRA_AGE_MULTIPLIERS[ageBracket] || 1.0;
    const adjustedCost = Math.round(baseCost * multiplier);
    
    features.push({
      id: featureId,
      name: formatFeatureName(featureId),
      baseCost,
      multiplier,
      cost: adjustedCost
    });
  }
  
  return features;
};

/**
 * Get available riders with costs for given coverage and age
 */
const getRiderCosts = async (coverageKey, age = 30, tenure = 1) => {
  const riders = [];
  
  for (const [riderId, costs] of Object.entries(VAJRA_RIDER_COSTS_BASE)) {
    const baseCost = costs[coverageKey] || costs['10L'];
    const ageBracket = getVajraAgeBracket(age);
    const multiplier = VAJRA_AGE_MULTIPLIERS[ageBracket] || 1.0;
    const adjustedCost = Math.round(baseCost * multiplier);
    
    riders.push({
      id: riderId,
      name: formatRiderName(riderId),
      baseCost,
      multiplier,
      cost: adjustedCost
    });
  }
  
  return riders;
};

/**
 * Get available chronic conditions with costs for given coverage and age
 */
const getChronicCosts = async (coverageKey, age = 30) => {
  const conditions = [];
  
  for (const [conditionId, costs] of Object.entries(VAJRA_CHRONIC_COSTS_BASE)) {
    const baseCost = costs[coverageKey] || costs['10L'];
    const ageBracket = getVajraAgeBracket(age);
    const multiplier = VAJRA_AGE_MULTIPLIERS[ageBracket] || 1.0;
    const adjustedCost = Math.round(baseCost * multiplier);
    
    conditions.push({
      id: conditionId,
      name: formatConditionName(conditionId),
      baseCost,
      multiplier,
      cost: adjustedCost
    });
  }
  
  return conditions;
};

/**
 * Get all pricing data for a coverage and age
 */
const getAllPricing = async (coverageKey, age = 30, tenure = 1) => {
  const [features, riders, chronicConditions] = await Promise.all([
    getFeatureCosts(coverageKey, age),
    getRiderCosts(coverageKey, age, tenure),
    getChronicCosts(coverageKey, age)
  ]);
  
  return {
    coverageKey,
    age,
    ageBracket: getVajraAgeBracket(age),
    multiplier: VAJRA_AGE_MULTIPLIERS[getVajraAgeBracket(age)] || 1.0,
    features,
    riders,
    chronicConditions
  };
};

// Helper functions to format display names
function formatFeatureName(id) {
  const names = {
    'pre_hosp_30': 'Pre-Hospitalization (30 Days)',
    'pre_hosp_60': 'Pre-Hospitalization (60 Days)',
    'pre_hosp_90': 'Pre-Hospitalization (90 Days)',
    'post_hosp_60': 'Post-Hospitalization (60 Days)',
    'post_hosp_90': 'Post-Hospitalization (90 Days)',
    'post_hosp_180': 'Post-Hospitalization (180 Days)',
    'global': 'Global Coverage',
    'non_deduct': 'Non-Deductible Benefit',
    'health_check': 'Annual Health Check-up',
    'restore': 'Restore Benefit',
    'maternity_global': 'Global Maternity Cover',
    'ambulance': 'Ambulance Cover',
    'air_amb': 'Air Ambulance Cover',
    'hosp_mandatory': 'Hospitalization (Base)',
    'day_care': 'Day Care Procedures',
    'ncb': 'No Claim Bonus',
    'ayush': 'AYUSH Treatment',
    'organ': 'Organ Donor Expenses',
    'domiciliary': 'Domiciliary Treatment'
  };
  return names[id] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatRiderName(id) {
  const names = {
    'unlimited_care': 'Unlimited Care',
    'inflation_shield': 'Inflation Shield',
    'tele_consult': 'Tele-Consultation',
    'smart_agg_2y': 'Smart Aggregate (2 Year)',
    'smart_agg_3y': 'Smart Aggregate (3 Year)',
    'super_bonus': 'Super No Claim Bonus',
    'maternity_boost': 'Maternity Boost',
    'ped_wait_2y': 'PED Wait Reduction (2 to 1 Year)',
    'ped_wait_1y': 'PED Wait Reduction (1 Year Waiver)',
    'specific_wait': 'Specific Illness Wait Reduction'
  };
  return names[id] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatConditionName(id) {
  const names = {
    'diabetes': 'Diabetes Care',
    'high_cholesterol': 'High Cholesterol Care',
    'copd': 'COPD Care',
    'heart_disease': 'Heart Disease Care',
    'hypertension': 'Hypertension Care',
    'asthma': 'Asthma Care'
  };
  return names[id] || id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

module.exports = {
  calculatePremium,
  getFeatureCosts,
  getRiderCosts,
  getChronicCosts,
  getAllPricing
};
