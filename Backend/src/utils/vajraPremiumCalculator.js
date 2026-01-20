/**
 * VAJRA Premium Calculator Utility (Backend)
 * Shared premium calculation functions for VAJRA Suraksha (Custom Plan)
 */

// ====================================================================
// VAJRA AGE MULTIPLIERS
// ====================================================================
const VAJRA_AGE_MULTIPLIERS = {
  '18-25': 1.00,
  '26-35': 1.20,
  '36-45': 1.45,
  '46-50': 1.65,
  '51-56': 1.85,
  '57-64': 2.20,
  '65+': 2.60
};

// ====================================================================
// VAJRA FEATURE COSTS (Base rate for 18-25 age group)
// ====================================================================
const VAJRA_FEATURE_COSTS_BASE = {
  'pre_hosp_30': { '10L': 110, '15L': 130, '20L': 150, '30L': 170, '50L': 220, '1Cr': 310, '1.5Cr': 380, '2Cr': 440, '3Cr': 530, '5Cr': 650, 'Unlimited': 750 },
  'pre_hosp_60': { '10L': 200, '15L': 230, '20L': 260, '30L': 310, '50L': 390, '1Cr': 550, '1.5Cr': 670, '2Cr': 780, '3Cr': 950, '5Cr': 1170, 'Unlimited': 1350 },
  'pre_hosp_90': { '10L': 280, '15L': 330, '20L': 370, '30L': 430, '50L': 540, '1Cr': 780, '1.5Cr': 950, '2Cr': 1100, '3Cr': 1330, '5Cr': 1640, 'Unlimited': 1890 },
  'post_hosp_60': { '10L': 460, '15L': 540, '20L': 600, '30L': 710, '50L': 890, '1Cr': 1280, '1.5Cr': 1550, '2Cr': 1800, '3Cr': 2190, '5Cr': 2690, 'Unlimited': 3100 },
  'post_hosp_90': { '10L': 800, '15L': 940, '20L': 1050, '30L': 1240, '50L': 1560, '1Cr': 2230, '1.5Cr': 2710, '2Cr': 3150, '3Cr': 3830, '5Cr': 4710, 'Unlimited': 5430 },
  'post_hosp_180': { '10L': 1310, '15L': 1550, '20L': 1730, '30L': 2030, '50L': 2560, '1Cr': 3670, '1.5Cr': 4460, '2Cr': 5180, '3Cr': 6300, '5Cr': 7740, 'Unlimited': 8920 },
  'global': { '10L': 640, '15L': 760, '20L': 850, '30L': 1000, '50L': 1260, '1Cr': 1810, '1.5Cr': 2190, '2Cr': 2550, '3Cr': 3100, '5Cr': 3810, 'Unlimited': 4390 },
  'non_deduct': { '10L': 240, '15L': 280, '20L': 320, '30L': 370, '50L': 470, '1Cr': 670, '1.5Cr': 810, '2Cr': 940, '3Cr': 1150, '5Cr': 1410, 'Unlimited': 1630 },
  'health_check': { '10L': 500, '15L': 590, '20L': 660, '30L': 770, '50L': 970, '1Cr': 1400, '1.5Cr': 1700, '2Cr': 1970, '3Cr': 2400, '5Cr': 2940, 'Unlimited': 3390 },
  'restore': { '10L': 290, '15L': 340, '20L': 380, '30L': 450, '50L': 560, '1Cr': 810, '1.5Cr': 980, '2Cr': 1140, '3Cr': 1390, '5Cr': 1710, 'Unlimited': 1970 },
  'maternity_global': { '10L': 530, '15L': 630, '20L': 700, '30L': 820, '50L': 1040, '1Cr': 1490, '1.5Cr': 1810, '2Cr': 2100, '3Cr': 2550, '5Cr': 3140, 'Unlimited': 3620 },
  'ambulance': { '10L': 150, '15L': 180, '20L': 200, '30L': 230, '50L': 290, '1Cr': 420, '1.5Cr': 510, '2Cr': 590, '3Cr': 720, '5Cr': 880, 'Unlimited': 1010 },
  'air_amb': { '10L': 300, '15L': 350, '20L': 400, '30L': 460, '50L': 580, '1Cr': 840, '1.5Cr': 1020, '2Cr': 1180, '3Cr': 1440, '5Cr': 1770, 'Unlimited': 2040 },
  'hosp_mandatory': { '10L': 3890, '15L': 4590, '20L': 5130, '30L': 6030, '50L': 7590, '1Cr': 10890, '1.5Cr': 13230, '2Cr': 15370, '3Cr': 18670, '5Cr': 22950, 'Unlimited': 26450 },
  'day_care': { '10L': 1550, '15L': 1830, '20L': 2040, '30L': 2400, '50L': 3020, '1Cr': 4330, '1.5Cr': 5260, '2Cr': 6110, '3Cr': 7430, '5Cr': 9130, 'Unlimited': 10520 },
  'ncb': { '10L': 120, '15L': 140, '20L': 160, '30L': 180, '50L': 230, '1Cr': 330, '1.5Cr': 400, '2Cr': 470, '3Cr': 570, '5Cr': 700, 'Unlimited': 810 },
  'ayush': { '10L': 990, '15L': 1160, '20L': 1300, '30L': 1530, '50L': 1920, '1Cr': 2760, '1.5Cr': 3360, '2Cr': 3900, '3Cr': 4740, '5Cr': 5820, 'Unlimited': 6710 },
  'organ': { '10L': 1790, '15L': 2110, '20L': 2360, '30L': 2770, '50L': 3490, '1Cr': 5010, '1.5Cr': 6090, '2Cr': 7070, '3Cr': 8590, '5Cr': 10560, 'Unlimited': 12170 },
  'domiciliary': { '10L': 1290, '15L': 1520, '20L': 1700, '30L': 2000, '50L': 2520, '1Cr': 3610, '1.5Cr': 4390, '2Cr': 5100, '3Cr': 6190, '5Cr': 7610, 'Unlimited': 8770 }
};

// ====================================================================
// VAJRA CHRONIC CARE COSTS (Per condition, base 18-25)
// ====================================================================
const VAJRA_CHRONIC_COSTS_BASE = {
  'diabetes': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'high_cholesterol': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'copd': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'heart_disease': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'hypertension': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'asthma': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 }
};

// ====================================================================
// VAJRA RIDER COSTS (Base 18-25)
// ====================================================================
const VAJRA_RIDER_COSTS_BASE = {
  'unlimited_care': { '10L': 610, '15L': 940, '20L': 1270, '30L': 1610, '50L': 1940, '1Cr': 2270, '1.5Cr': 2600, '2Cr': 2940, '3Cr': 3270, '5Cr': 3600, 'Unlimited': 0 },
  'inflation_shield': { '10L': 150, '15L': 180, '20L': 200, '30L': 230, '50L': 290, '1Cr': 420, '1.5Cr': 510, '2Cr': 590, '3Cr': 720, '5Cr': 880, 'Unlimited': 0 },
  'tele_consult': { '10L': 200, '15L': 230, '20L': 260, '30L': 310, '50L': 390, '1Cr': 560, '1.5Cr': 680, '2Cr': 790, '3Cr': 960, '5Cr': 1170, 'Unlimited': 1350 },
  'smart_agg_2y': { '10L': 190, '15L': 220, '20L': 250, '30L': 290, '50L': 370, '1Cr': 530, '1.5Cr': 640, '2Cr': 750, '3Cr': 910, '5Cr': 1120, 'Unlimited': 0 },
  'smart_agg_3y': { '10L': 240, '15L': 280, '20L': 310, '30L': 370, '50L': 460, '1Cr': 660, '1.5Cr': 800, '2Cr': 930, '3Cr': 1130, '5Cr': 1390, 'Unlimited': 0 },
  'super_bonus': { '10L': 920, '15L': 1080, '20L': 1210, '30L': 1420, '50L': 1790, '1Cr': 2560, '1.5Cr': 3110, '2Cr': 3620, '3Cr': 4400, '5Cr': 5400, 'Unlimited': 6230 },
  'maternity_boost': { '10L': 24090, '15L': 28420, '20L': 31790, '30L': 37330, '50L': 46970, '1Cr': 67440, '1.5Cr': 81900, '2Cr': 95140, '3Cr': 115620, '5Cr': 142110, 'Unlimited': 142110 },
  'ped_wait_2y': { '10L': 530, '15L': 620, '20L': 700, '30L': 820, '50L': 1030, '1Cr': 1480, '1.5Cr': 1800, '2Cr': 2090, '3Cr': 2530, '5Cr': 3120, 'Unlimited': 3590 },
  'ped_wait_1y': { '10L': 730, '15L': 860, '20L': 960, '30L': 1130, '50L': 1420, '1Cr': 2040, '1.5Cr': 2480, '2Cr': 2880, '3Cr': 3490, '5Cr': 4300, 'Unlimited': 4950 },
  'specific_wait': { '10L': 1580, '15L': 1870, '20L': 2090, '30L': 2450, '50L': 3080, '1Cr': 4430, '1.5Cr': 5380, '2Cr': 6240, '3Cr': 7590, '5Cr': 9330, 'Unlimited': 10750 }
};

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

/**
 * Get VAJRA age bracket from age
 */
const getVajraAgeBracket = (age) => {
  const a = parseFloat(age);
  if (isNaN(a) || a < 18) return '18-25';
  if (a >= 18 && a <= 25) return '18-25';
  if (a >= 26 && a <= 35) return '26-35';
  if (a >= 36 && a <= 45) return '36-45';
  if (a >= 46 && a <= 50) return '46-50';
  if (a >= 51 && a <= 56) return '51-56';
  if (a >= 57 && a <= 64) return '57-64';
  return '65+';
};

/**
 * Get coverage key from sum insured value/label
 */
const getVajraCoverageKey = (si) => {
  if (!si) return '10L';
  
  let checkStr = (typeof si === 'object' ? (si.label || si.value || '') : si.toString());
  checkStr = checkStr.toLowerCase().replace(/\s/g, '');
  
  if (checkStr.includes('10l') || checkStr === '1000000') return '10L';
  if (checkStr.includes('15l') || checkStr === '1500000') return '15L';
  if (checkStr.includes('20l') || checkStr === '2000000') return '20L';
  if (checkStr.includes('30l') || checkStr === '3000000') return '30L';
  if (checkStr.includes('50l') || checkStr === '5000000') return '50L';
  if (checkStr.includes('1.5cr') || checkStr.includes('1,5cr') || checkStr === '15000000') return '1.5Cr';
  if (checkStr.includes('1cr') || checkStr === '10000000') return '1Cr';
  if (checkStr.includes('2cr') || checkStr === '20000000') return '2Cr';
  if (checkStr.includes('3cr') || checkStr === '30000000') return '3Cr';
  if (checkStr.includes('5cr') || checkStr === '50000000') return '5Cr';
  if (checkStr.includes('unlimited') || checkStr.includes('999999999')) return 'Unlimited';
  
  return '10L';
};

/**
 * Normalize ID for comparison
 */
const normalizeId = (id) => {
  if (!id) return '';
  return String(id).toLowerCase().replace(/[\s_-]+/g, '');
};

/**
 * Get VAJRA feature cost with age multiplier applied
 */
const getVajraFeatureCost = (featureId, coverageKey, age) => {
  const normalizedId = normalizeId(featureId);
  const featureKey = Object.keys(VAJRA_FEATURE_COSTS_BASE).find(
    k => normalizeId(k) === normalizedId
  );
  
  if (!featureKey) return 0;
  
  const baseCosts = VAJRA_FEATURE_COSTS_BASE[featureKey];
  const baseCost = baseCosts[coverageKey] || baseCosts['10L'];
  const ageBracket = getVajraAgeBracket(age);
  const multiplier = VAJRA_AGE_MULTIPLIERS[ageBracket] || 1.0;
  
  return Math.round(baseCost * multiplier);
};

/**
 * Get VAJRA chronic condition cost with age multiplier
 */
const getVajraChronicCost = (conditionId, coverageKey, age) => {
  const conditionKey = String(conditionId).toLowerCase().replace(/\s+/g, '_');
  const baseCosts = VAJRA_CHRONIC_COSTS_BASE[conditionKey];
  
  if (!baseCosts) return 0;
  
  const baseCost = baseCosts[coverageKey] || baseCosts['10L'];
  const ageBracket = getVajraAgeBracket(age);
  const multiplier = VAJRA_AGE_MULTIPLIERS[ageBracket] || 1.0;
  
  return Math.round(baseCost * multiplier);
};

/**
 * Get VAJRA rider cost with age multiplier
 */
const getVajraRiderCost = (riderId, coverageKey, age, tenure = 1) => {
  // Handle smart aggregate based on tenure
  let effectiveRiderId = riderId;
  if (riderId === 'smart_agg' || riderId === 'smartagg') {
    effectiveRiderId = tenure === 2 ? 'smart_agg_2y' : 'smart_agg_3y';
  }
  
  // Handle PED wait variants
  if (riderId === 'ped_wait' || riderId === 'pedwait') {
    effectiveRiderId = 'ped_wait_1y'; // Default to 1 year reduction
  }
  
  const normalizedId = normalizeId(effectiveRiderId);
  const riderKey = Object.keys(VAJRA_RIDER_COSTS_BASE).find(
    k => normalizeId(k) === normalizedId
  );
  
  if (!riderKey) return 0;
  
  const baseCosts = VAJRA_RIDER_COSTS_BASE[riderKey];
  const baseCost = baseCosts[coverageKey] || baseCosts['10L'];
  const ageBracket = getVajraAgeBracket(age);
  const multiplier = VAJRA_AGE_MULTIPLIERS[ageBracket] || 1.0;
  
  return Math.round(baseCost * multiplier);
};

/**
 * Calculate total VAJRA premium for a configuration
 */
const calculateVajraPremium = ({
  coverageKey,
  ages = [],
  preHosp = 60,
  postHosp = 90,
  features = [],
  riders = [],
  chronicConditions = [],
  tenure = 1
}) => {
  const effectiveCoverageKey = coverageKey || '10L';
  const eldestAge = ages.length > 0 ? Math.max(...ages.map(a => parseFloat(a) || 0)) : 30;
  
  let totalPremium = 0;
  const breakdown = {
    basePremium: 0,
    featureCost: 0,
    riderCost: 0,
    chronicCost: 0,
    items: []
  };
  
  // Calculate base premium per member (hosp_mandatory)
  ages.forEach(age => {
    const baseCost = getVajraFeatureCost('hosp_mandatory', effectiveCoverageKey, age);
    breakdown.basePremium += baseCost;
    breakdown.items.push({
      type: 'base',
      label: `Member (Age ${age})`,
      cost: baseCost
    });
  });
  
  // Add pre-hospitalization feature based on selection
  const preHospKey = `pre_hosp_${preHosp}`;
  if (VAJRA_FEATURE_COSTS_BASE[preHospKey]) {
    const cost = getVajraFeatureCost(preHospKey, effectiveCoverageKey, eldestAge);
    breakdown.featureCost += cost;
    breakdown.items.push({
      type: 'feature',
      label: `Pre-Hospitalization (${preHosp} days)`,
      cost
    });
  }
  
  // Add post-hospitalization feature based on selection
  const postHospKey = `post_hosp_${postHosp}`;
  if (VAJRA_FEATURE_COSTS_BASE[postHospKey]) {
    const cost = getVajraFeatureCost(postHospKey, effectiveCoverageKey, eldestAge);
    breakdown.featureCost += cost;
    breakdown.items.push({
      type: 'feature',
      label: `Post-Hospitalization (${postHosp} days)`,
      cost
    });
  }
  
  // Add selected features
  features.forEach(feat => {
    const featId = typeof feat === 'string' ? feat : (feat.id || feat.name || '');
    const isActive = typeof feat === 'object' ? feat.active !== false : true;
    
    if (!isActive) return;
    
    // Skip hosp_mandatory (already in base) and pre/post hosp (handled separately)
    const normalizedFeatId = normalizeId(featId);
    if (normalizedFeatId === 'hospmandatory' || 
        normalizedFeatId.startsWith('prehosp') || 
        normalizedFeatId.startsWith('posthosp')) {
      return;
    }
    
    const cost = getVajraFeatureCost(featId, effectiveCoverageKey, eldestAge);
    if (cost > 0) {
      breakdown.featureCost += cost;
      breakdown.items.push({
        type: 'feature',
        label: featId,
        cost
      });
    }
  });
  
  // Add selected riders
  riders.forEach(rider => {
    const riderId = typeof rider === 'string' ? rider : (rider.id || rider.name || '');
    const isActive = typeof rider === 'object' ? rider.active !== false : true;
    
    if (!isActive) return;
    
    const cost = getVajraRiderCost(riderId, effectiveCoverageKey, eldestAge, tenure);
    if (cost > 0) {
      breakdown.riderCost += cost;
      breakdown.items.push({
        type: 'rider',
        label: riderId,
        cost
      });
    }
  });
  
  // Add chronic conditions
  chronicConditions.forEach(condition => {
    const condId = typeof condition === 'string' ? condition : (condition.id || condition.name || '');
    const cost = getVajraChronicCost(condId, effectiveCoverageKey, eldestAge);
    if (cost > 0) {
      breakdown.chronicCost += cost;
      breakdown.items.push({
        type: 'chronic',
        label: `Chronic Care: ${condId}`,
        cost
      });
    }
  });
  
  totalPremium = breakdown.basePremium + breakdown.featureCost + breakdown.riderCost + breakdown.chronicCost;
  
  // Apply tenure discount
  let discountPercent = 0;
  if (tenure === 2) discountPercent = 5;
  if (tenure === 3) discountPercent = 10;
  
  const discountAmount = Math.round(totalPremium * (discountPercent / 100));
  const netPremium = totalPremium - discountAmount;
  const gstAmount = Math.round(netPremium * 0.18);
  const finalPremium = netPremium + gstAmount;
  
  return {
    breakdown,
    totalPremium,
    discountPercent,
    discountAmount,
    netPremium,
    gstAmount,
    finalPremium,
    tenure,
    totalPayable: finalPremium * tenure
  };
};

module.exports = {
  VAJRA_AGE_MULTIPLIERS,
  VAJRA_FEATURE_COSTS_BASE,
  VAJRA_CHRONIC_COSTS_BASE,
  VAJRA_RIDER_COSTS_BASE,
  getVajraAgeBracket,
  getVajraCoverageKey,
  normalizeId,
  getVajraFeatureCost,
  getVajraChronicCost,
  getVajraRiderCost,
  calculateVajraPremium
};
