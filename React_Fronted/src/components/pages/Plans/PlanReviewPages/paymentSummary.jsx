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
  'maternity': { label: 'Maternity Cover', cost: 12000 }, // Default, will be overridden for Parivar
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

// Parivar Suraksha Premium Table from CSV (per person per annum)
// Age bands: 18-22, 23-27, 28-32, 33-37, 38-42, 43-47, 48-52, 53-57, 58-62, 63-67, 68-70
// Ages < 18 use 18-22 band, Ages > 70 use 68-70 band (capped)
const PARIVAR_PREMIUM_TABLE = {
  '10L': { '18-22': 8500, '23-27': 9520, '28-32': 10662, '33-37': 11941, '38-42': 13374, '43-47': 14979, '48-52': 16777, '53-57': 18790, '58-62': 21045, '63-67': 23571, '68-70': 26399 },
  '15L': { '18-22': 10625, '23-27': 11900, '28-32': 13327, '33-37': 14926, '38-42': 16717, '43-47': 18723, '48-52': 20971, '53-57': 23487, '58-62': 26306, '63-67': 29463, '68-70': 32998 },
  '20L': { '18-22': 12750, '23-27': 14280, '28-32': 15993, '33-37': 17911, '38-42': 20061, '43-47': 22468, '48-52': 25165, '53-57': 28185, '58-62': 31567, '63-67': 35356, '68-70': 39598 },
  '25L': { '18-22': 14875, '23-27': 16660, '28-32': 18658, '33-37': 20896, '38-42': 23404, '43-47': 26213, '48-52': 29359, '53-57': 32882, '58-62': 36828, '63-67': 41249, '68-70': 46198 },
  '50L': { '18-22': 21250, '23-27': 23800, '28-32': 26655, '33-37': 29852, '38-42': 33435, '43-47': 37447, '48-52': 41942, '53-57': 46975, '58-62': 52612, '63-67': 58927, '68-70': 65997 },
  '1Cr': { '18-22': 29750, '23-27': 33320, '28-32': 37317, '33-37': 41793, '38-42': 46809, '43-47': 52426, '48-52': 58719, '53-57': 65765, '58-62': 73657, '63-67': 82498, '68-70': 92396 }
};

// Vishwa Suraksha Premium Table from CSV (per person per annum)
// Age Slabs: Below 18, 18-22, 23-27, 28-32, 33-37, 38-42, 43-47, 48-52, 53-57, 58-62, 63-67, 68-70, Above 70
// Coverage Options: 50L, 1Cr, 2Cr, 5Cr, Unlimited (99Cr)
const VISHWA_PREMIUM_TABLE = {
  '50L': { 'below18': 65800, '18-22': 67800, '23-27': 73224, '28-32': 78648, '33-37': 84750, '38-42': 91530, '43-47': 101699, '48-52': 115261, '53-57': 132210, '58-62': 152550, '63-67': 176280, '68-70': 203400, 'above70': 206400 },
  '1Cr': { 'below18': 78512, '18-22': 80512, '23-27': 86954, '28-32': 93394, '33-37': 100641, '38-42': 108691, '43-47': 120768, '48-52': 136872, '53-57': 156999, '58-62': 181154, '63-67': 209332, '68-70': 241538, 'above70': 244538 },
  '2Cr': { 'below18': 99700, '18-22': 101700, '23-27': 109836, '28-32': 117972, '33-37': 127126, '38-42': 137294, '43-47': 152549, '48-52': 172891, '53-57': 198314, '58-62': 228826, '63-67': 264420, '68-70': 305100, 'above70': 308100 },
  '5Cr': { 'below18': 133600, '18-22': 135600, '23-27': 146448, '28-32': 157296, '33-37': 169501, '38-42': 183059, '43-47': 203398, '48-52': 230522, '53-57': 264419, '58-62': 305101, '63-67': 352560, '68-70': 406800, 'above70': 409800 },
  'Unlimited': { 'below18': 159025, '18-22': 161025, '23-27': 173907, '28-32': 186789, '33-37': 201282, '38-42': 217383, '43-47': 241536, '48-52': 273744, '53-57': 313998, '58-62': 362307, '63-67': 418665, '68-70': 483075, 'above70': 486075 }
};

// Vishwa Suraksha OPD Rider Options from CSV
const VISHWA_OPD_OPTIONS = {
  '25k': { 'below18': 15000, '18-22': 17000, '23-27': 18360, '28-32': 19720, '33-37': 21250, '38-42': 22950, '43-47': 25500, '48-52': 28900, '53-57': 33150, '58-62': 38250, '63-67': 44200, '68-70': 51000, 'above70': 54000 },
  '50k': { 'below18': 27000, '18-22': 29000, '23-27': 31320, '28-32': 33640, '33-37': 36250, '38-42': 39150, '43-47': 43500, '48-52': 49300, '53-57': 56550, '58-62': 65250, '63-67': 75400, '68-70': 87000, 'above70': 90000 },
  '75k': { 'below18': 40000, '18-22': 42000, '23-27': 45360, '28-32': 48720, '33-37': 52500, '38-42': 56700, '43-47': 63000, '48-52': 71400, '53-57': 81900, '58-62': 94500, '63-67': 109200, '68-70': 126000, 'above70': 129000 },
  '1L': { 'below18': 49000, '18-22': 51000, '23-27': 55080, '28-32': 59160, '33-37': 63750, '38-42': 68850, '43-47': 76500, '48-52': 86700, '53-57': 99450, '58-62': 114750, '63-67': 132600, '68-70': 153000, 'above70': 156000 }
};

// Vishwa Suraksha Base Premium (without coverage selection) from CSV
const VISHWA_BASE_PREMIUM = {
  'below18': 40375, '18-22': 42375, '23-27': 45765, '28-32': 49155, '33-37': 52969, '38-42': 57206, '43-47': 63562, '48-52': 72038, '53-57': 82631, '58-62': 95344, '63-67': 110175, '68-70': 127125, 'above70': 130125
};

// Varishtha Suraksha Premium Table (Senior Citizen Plan - 60+ years only)
// Age Groups: 60-65, 66-70, 71-75, 76-100
// Coverage Options: 5L, 10L, 15L, 25L, 50L
const VARISHTHA_PREMIUM_TABLE = {
  '5L': {
    '60-65': 14136,
    '66-70': 18296,
    '71-75': 23396,
    '76-100': 28836
  },
  '10L': {
    '60-65': 18344,
    '66-70': 23696,
    '71-75': 30320,
    '76-100': 37360
  },
  '15L': {
    '60-65': 27516,
    '66-70': 35544,
    '71-75': 45480,
    '76-100': 56040
  },
  '25L': {
    '60-65': 45860,
    '66-70': 59240,
    '71-75': 75800,
    '76-100': 93400
  },
  '50L': {
    '60-65': 91720,
    '66-70': 118480,
    '71-75': 151600,
    '76-100': 186800
  }
};

// Get Parivar age band (5-year slabs)
// Ages < 18 use 18-22 band, Ages > 70 use 68-70 band (capped)
const getParivarAgeBand = (age) => {
  const a = parseFloat(age);
  if (isNaN(a) || a < 18) return '18-22';  // Below 18 uses 18-22 rate
  if (a >= 18 && a <= 22) return '18-22';
  if (a >= 23 && a <= 27) return '23-27';
  if (a >= 28 && a <= 32) return '28-32';
  if (a >= 33 && a <= 37) return '33-37';
  if (a >= 38 && a <= 42) return '38-42';
  if (a >= 43 && a <= 47) return '43-47';
  if (a >= 48 && a <= 52) return '48-52';
  if (a >= 53 && a <= 57) return '53-57';
  if (a >= 58 && a <= 62) return '58-62';
  if (a >= 63 && a <= 67) return '63-67';
  return '68-70';  // 68+ capped at 68-70 rate
};

// Get Vishwa Suraksha age bracket based on CSV age slabs
const getVishwaAgeBracket = (age) => {
  const a = parseFloat(age);
  if (isNaN(a) || a < 18) return 'below18';
  if (a >= 18 && a <= 22) return '18-22';
  if (a >= 23 && a <= 27) return '23-27';
  if (a >= 28 && a <= 32) return '28-32';
  if (a >= 33 && a <= 37) return '33-37';
  if (a >= 38 && a <= 42) return '38-42';
  if (a >= 43 && a <= 47) return '43-47';
  if (a >= 48 && a <= 52) return '48-52';
  if (a >= 53 && a <= 57) return '53-57';
  if (a >= 58 && a <= 62) return '58-62';
  if (a >= 63 && a <= 67) return '63-67';
  if (a >= 68 && a <= 70) return '68-70';
  return 'above70';  // Above 70 years
};

// Get Vishwa premium from table based on age and coverage
const getVishwaPremium = (age, coverageKey) => {
  const ageBracket = getVishwaAgeBracket(age);
  const validKeys = ['50L', '1Cr', '2Cr', '5Cr', 'Unlimited'];
  const effectiveKey = validKeys.includes(coverageKey) ? coverageKey : '1Cr';
  return VISHWA_PREMIUM_TABLE[effectiveKey]?.[ageBracket] || VISHWA_PREMIUM_TABLE['1Cr'][ageBracket];
};

// Get Vishwa OPD rider cost based on age and OPD limit selection
const getVishwaOPDCost = (age, opdLimit) => {
  const ageBracket = getVishwaAgeBracket(age);
  const validOPDKeys = ['25k', '50k', '75k', '1L'];
  const effectiveKey = validOPDKeys.includes(opdLimit) ? opdLimit : null;
  if (!effectiveKey) return 0;
  return VISHWA_OPD_OPTIONS[effectiveKey]?.[ageBracket] || 0;
};

// Varishtha Suraksha Rider Costs (from CSV specification)
const VARISHTHA_RIDER_COSTS = {
  // Chronic Care Conditions Cover (from Day 31) - ₹4,032 per condition
  chronicCare: {
    perCondition: 4032,
    conditions: ['diabetes', 'high_cholesterol', 'copd', 'heart_disease', 'hypertension', 'asthma']
  },
  // PED Waiting Period Reduction (3 years to 1 year)
  pedReduction: 3387,
  // Specific Illness Waiting Period Reduction (2 years to 1 year)
  specificIllnessReduction: 5302,
  // Co-pay Waiver Options (reduces from 10% standard)
  copayWaiver: {
    '5%': 1234,   // Reduce to 5% co-pay
    '0%': 1934    // Reduce to 0% co-pay (nil)
  },
  // Non-Medical Consumables Cover
  consumables: 996,
  // Room Rent Options (upgrade from Single Private Room)
  roomRent: {
    'Any Room': 1267,            // Any room category
    'Deluxe Room': 967,          // Deluxe room
    'Single Private AC Room': 489 // Single Private AC Room
  },
  // Voluntary Deductible Discounts (reduces premium)
  deductible: {
    '10k': 1568,   // ₹10,000 deductible
    '25k': 3067,   // ₹25,000 deductible
    '50k': 4998,   // ₹50,000 deductible
    '1L': 8654     // ₹1,00,000 deductible
  }
};

// Get Varishtha chronic care cost based on selected conditions
const getVarishthaChronicCost = (selectedConditions = []) => {
  if (!Array.isArray(selectedConditions) || selectedConditions.length === 0) return 0;
  return selectedConditions.length * VARISHTHA_RIDER_COSTS.chronicCare.perCondition;
};

// Get Varishtha co-pay waiver cost
const getVarishthaCopayWaiverCost = (copayLevel) => {
  if (copayLevel === 'standard' || !copayLevel) return 0;
  return VARISHTHA_RIDER_COSTS.copayWaiver[copayLevel] || 0;
};

// Get Varishtha room rent upgrade cost
const getVarishthaRoomCost = (roomType) => {
  if (!roomType || roomType === 'Single Private Room') return 0;
  return VARISHTHA_RIDER_COSTS.roomRent[roomType] || 0;
};

// Get Varishtha deductible discount
const getVarishthaDeductibleDiscount = (deductible) => {
  if (deductible === 'None' || !deductible) return 0;
  return VARISHTHA_RIDER_COSTS.deductible[deductible] || 0;
};

// Get Varishtha Suraksha age bracket (Senior Citizen - 60+ only)
const getVarishthaAgeBracket = (age) => {
  const a = parseFloat(age);
  if (isNaN(a) || a < 60) return '60-65'; // Default to lowest bracket if under 60
  if (a >= 60 && a <= 65) return '60-65';
  if (a >= 66 && a <= 70) return '66-70';
  if (a >= 71 && a <= 75) return '71-75';
  return '76-100'; // 76 and above
};

// Get Varishtha premium from table based on age and coverage
const getVarishthaPremium = (age, coverageKey) => {
  const ageBracket = getVarishthaAgeBracket(age);
  const validKeys = ['5L', '10L', '15L', '25L', '50L'];
  const effectiveKey = validKeys.includes(coverageKey) ? coverageKey : '10L';
  return VARISHTHA_PREMIUM_TABLE[effectiveKey]?.[ageBracket] || VARISHTHA_PREMIUM_TABLE['10L'][ageBracket];
};

// Get Parivar premium for a specific age and coverage
const getParivarPremium = (age, coverageKey) => {
  const ageBand = getParivarAgeBand(age);
  const validKeys = ['10L', '15L', '20L', '25L', '50L', '1Cr'];
  const effectiveKey = validKeys.includes(coverageKey) ? coverageKey : '10L';
  return PARIVAR_PREMIUM_TABLE[effectiveKey]?.[ageBand] || PARIVAR_PREMIUM_TABLE['10L']['18-22'];
};

// Room Rent Restriction Discounts (from CSV) - these reduce premium
// Room Rent Restriction Discounts (from CSV) - these reduce premium
// Twin Sharing = maximum cost saving, Single Private AC = least reduction
const ROOM_RENT_DISCOUNTS = {
  'single_pvt_ac': 300,      // Single Private AC Room - least reduction
  'Single Private AC Room': 300,
  'Single Private AC': 300,
  'single_pvt': 460,         // Single Private Room - moderate reduction  
  'Single Private Room': 460,
  'Single Private': 460,
  'twin': 640,               // Twin Sharing - maximum cost saving
  'Twin Sharing': 640,
  'twin_sharing': 640
};

// Get room rent discount amount
const getRoomRentDiscount = (roomRentRestriction) => {
  return ROOM_RENT_DISCOUNTS[roomRentRestriction] || 0;
};

// Parivar Suraksha Maternity Cover Limits based on Sum Insured
const PARIVAR_MATERNITY_CONFIG = {
  '10L': { limit: 75000, display: '₹75,000' },
  '15L': { limit: 75000, display: '₹75,000' },
  '20L': { limit: 100000, display: '₹1,00,000' },
  '25L': { limit: 100000, display: '₹1,00,000' },
  '50L': { limit: 200000, display: '₹2,00,000' },
  '1Cr': { limit: 200000, display: '₹2,00,000' }
};

// Vishwa Suraksha Maternity Cover Limits based on Sum Insured (from CSV)
// ₹1L for 50L SI, ₹2L for 1Cr/2Cr SI, ₹2.5L for 5Cr/Unlimited SI
const VISHWA_MATERNITY_CONFIG = {
  '50L': { limit: 100000, display: '₹1,00,000', cost: 15000 },
  '1Cr': { limit: 200000, display: '₹2,00,000', cost: 18000 },
  '2Cr': { limit: 200000, display: '₹2,00,000', cost: 22000 },
  '5Cr': { limit: 250000, display: '₹2,50,000', cost: 28000 },
  'Unlimited': { limit: 250000, display: '₹2,50,000', cost: 35000 }
};

// Air Ambulance Rider cost (from CSV) - ₹250 flat
const AIR_AMBULANCE_RIDER_COST = 250;

// Check if maternity is eligible (requires Self + Spouse)
const checkMaternityEligibility = (counts = {}) => {
  const hasSelf = Number(counts.self || 0) > 0;
  const hasSpouse = Number(counts.spouse || 0) > 0;
  return hasSelf && hasSpouse;
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
  'maternity_boost': { label: 'Maternity Booster', cost: 8500 },
  'air_ambulance': { label: 'Air Ambulance Cover', cost: 250 }  // From CSV
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
    const isParivarPlan = planNameRaw.includes('parivar');
    const isVishwaPlan = planNameRaw.includes('vishwa');
    const isVarishthaPlan = planNameRaw.includes('varishtha');
    
    if (planNameRaw.includes('neev')) planMultiplier = PLAN_MULTIPLIERS.neev;
    else if (planNameRaw.includes('vishwa')) planMultiplier = PLAN_MULTIPLIERS.vishwa;
    else if (planNameRaw.includes('varishtha')) planMultiplier = PLAN_MULTIPLIERS.varishtha;
    else if (planNameRaw.includes('vajra') || selectedPlan.isCustom) planMultiplier = PLAN_MULTIPLIERS.vajra;
    else planMultiplier = PLAN_MULTIPLIERS.parivar;

    // Check maternity eligibility for Parivar plan (requires Self + Spouse)
    const isMaternityEligible = isParivarPlan ? checkMaternityEligibility(counts) : true;
    
    // Get OPD rider selection for Vishwa plan (if any)
    const opdRiderSelection = data.opdRider || data.selectedOPD || optionalEnhancements?.opd || null; 

    const effectiveSI = sumInsured || currentSI;
    const coverageKey = getCoverageKey(effectiveSI);
    const baseRatePerAdult = BASE_RATE_MATRIX[coverageKey] || BASE_RATE_MATRIX['10L'];
    
    // Get room rent restriction from plan data for Parivar discount
    // Check multiple possible sources for room rent selection
    const roomRentRestriction = selectedPlan?.room_rent_restriction || 
                                selectedPlan?.roomRentRestriction || 
                                roomRentLimit ||  // From FamilyPlanReview state
                                '';
    const roomRentDiscountPerMember = isParivarPlan ? getRoomRentDiscount(roomRentRestriction) : 0;
    
    let totalBasePremium = 0;
    let totalOPDCost = 0; // Track OPD cost separately for display
    const memberBreakdown = [];
    const explanationLines = [];

    Object.keys(counts).forEach(memberType => {
      const count = counts[memberType];
      if (count > 0) {
        const ages = Array.isArray(memberAges[memberType]) ? memberAges[memberType] : [memberAges[memberType]];
        
        ages.forEach((age, idx) => {
          if (!age) return;
          
          let adjustedPremium;
          let opdCost = 0;
          
          // Use Neev-specific premium table for Neev plan
          if (isNeevPlan) {
            adjustedPremium = getNeevPremium(age, coverageKey);
          } 
          // Use Parivar-specific premium table for Parivar plan
          else if (isParivarPlan) {
            adjustedPremium = getParivarPremium(age, coverageKey);
            // Room rent discount is applied separately in discountAmount, not here
          }
          // Use Vishwa-specific premium table for Vishwa plan (from CSV)
          else if (isVishwaPlan) {
            adjustedPremium = getVishwaPremium(age, coverageKey);
            // Add OPD rider cost if selected (tracked separately)
            if (opdRiderSelection) {
              opdCost = getVishwaOPDCost(age, opdRiderSelection);
              totalOPDCost += opdCost;
            }
          }
          // Use Varishtha-specific premium table for Senior Citizen plan (60+ years)
          else if (isVarishthaPlan) {
            adjustedPremium = getVarishthaPremium(age, coverageKey);
          }
          else {
            const adjustmentPercent = getAgeAdjustmentPercent(age);
            adjustedPremium = Math.round(baseRatePerAdult * (1 + (adjustmentPercent / 100)));
            adjustedPremium = Math.round(adjustedPremium * planMultiplier);
          }

          totalBasePremium += adjustedPremium;

          memberBreakdown.push({
            label: `${memberType.charAt(0).toUpperCase() + memberType.slice(1).replace('_', ' ')} ${idx + 1}`,
            age: age,
            base: isNeevPlan ? adjustedPremium : 
                  (isParivarPlan ? getParivarPremium(age, coverageKey) : 
                  (isVishwaPlan ? getVishwaPremium(age, coverageKey) : 
                  (isVarishthaPlan ? getVarishthaPremium(age, coverageKey) : baseRatePerAdult))),
            adjustment: isNeevPlan || isParivarPlan || isVishwaPlan || isVarishthaPlan ? 0 : getAgeAdjustmentPercent(age),
            final: adjustedPremium,
            opdCost: opdCost > 0 ? opdCost : undefined
          });
        });
      }
    });
    
    // Add OPD explanation line if selected for Vishwa plan
    if (isVishwaPlan && opdRiderSelection && totalOPDCost > 0) {
      const opdLimitDisplay = opdRiderSelection === '1L' ? '₹1,00,000' : `₹${opdRiderSelection.replace('k', ',000')}`;
      explanationLines.push(`Worldwide OPD (${opdLimitDisplay}): +₹${totalOPDCost.toLocaleString('en-IN')}`);
    }

    let featureCost = 0;
    let riderCost = 0;
    
    // Handle Varishtha plan riders (object format from SeniorPlanReview)
    if (isVarishthaPlan && riders && typeof riders === 'object' && !Array.isArray(riders)) {
      // Chronic Care Conditions - ₹4,032 per condition
      if (riders.chronicConditions && Array.isArray(riders.chronicConditions)) {
        const chronicCost = riders.chronicConditions.length * VARISHTHA_RIDER_COSTS.chronicCare.perCondition;
        if (chronicCost > 0) {
          riderCost += chronicCost;
          explanationLines.push(`Chronic Care (${riders.chronicConditions.length} conditions): +₹${chronicCost.toLocaleString('en-IN')}`);
        }
      }
      
      // PED Waiting Period Reduction - ₹3,387
      if (riders.pedCover) {
        riderCost += VARISHTHA_RIDER_COSTS.pedReduction;
        explanationLines.push(`PED Wait Reduction (3yr→1yr): +₹${VARISHTHA_RIDER_COSTS.pedReduction.toLocaleString('en-IN')}`);
      }
      
      // Specific Illness Reduction - ₹5,302
      if (riders.specificIllness) {
        riderCost += VARISHTHA_RIDER_COSTS.specificIllnessReduction;
        explanationLines.push(`Specific Illness Reduction: +₹${VARISHTHA_RIDER_COSTS.specificIllnessReduction.toLocaleString('en-IN')}`);
      }
      
      // Non-Medical Consumables - ₹996
      if (riders.consumables) {
        riderCost += VARISHTHA_RIDER_COSTS.consumables;
        explanationLines.push(`Non-Medical Consumables: +₹${VARISHTHA_RIDER_COSTS.consumables.toLocaleString('en-IN')}`);
      }
      
      // Co-pay Waiver
      if (riders.copayLevel && riders.copayLevel !== 'standard') {
        const copayWaiverCost = VARISHTHA_RIDER_COSTS.copayWaiver[riders.copayLevel] || 0;
        if (copayWaiverCost > 0) {
          riderCost += copayWaiverCost;
          explanationLines.push(`Co-pay Waiver (${riders.copayLevel}): +₹${copayWaiverCost.toLocaleString('en-IN')}`);
        }
      }
      
      // Room Rent Upgrade
      if (riders.roomUpgrade) {
        const roomCost = VARISHTHA_RIDER_COSTS.roomRent[riders.roomUpgrade] || 0;
        if (roomCost > 0) {
          riderCost += roomCost;
          explanationLines.push(`Room Upgrade (${riders.roomUpgrade}): +₹${roomCost.toLocaleString('en-IN')}`);
        }
      }
      
      // Voluntary Deductible Discount (reduces premium)
      if (riders.deductible && riders.deductible !== 'None') {
        const deductibleDiscount = VARISHTHA_RIDER_COSTS.deductible[riders.deductible] || 0;
        if (deductibleDiscount > 0) {
          riderCost -= deductibleDiscount; // Negative since it's a discount
          explanationLines.push(`Voluntary Deductible (₹${riders.deductible === '1L' ? '1,00,000' : riders.deductible.replace('k', ',000')}): -₹${deductibleDiscount.toLocaleString('en-IN')}`);
        }
      }
    } else {
      // Standard handling for array-based riders (other plans)
      const ridersArray = Array.isArray(riders) ? riders : [];
      const allAddons = [...(features || []), ...ridersArray];
    
      allAddons.forEach(item => {
        const isActive = typeof item === 'string' ? true : (item.active === true || item.selected === true);
        const itemId = typeof item === 'string' ? item : (item.id || item.name);
        
        if (isActive) {
          const nId = normalizeId(itemId);
        
        // Special handling for maternity in Parivar plan
        if (nId === 'maternity' && isParivarPlan) {
          if (isMaternityEligible) {
            const maternityConfig = PARIVAR_MATERNITY_CONFIG[coverageKey] || PARIVAR_MATERNITY_CONFIG['10L'];
            // Maternity rider cost based on age (from CSV)
            const maternityCost = maternityConfig.limit; // Using limit as cost per CSV
            featureCost += maternityCost;
            explanationLines.push(`Maternity Rider (Up to ${maternityConfig.display}): +₹${maternityCost.toLocaleString('en-IN')}`);
          } else {
            explanationLines.push(`Maternity Cover: Not eligible (requires Self + Spouse)`);
          }
        } 
        // Special handling for maternity in Vishwa plan (SI-based limits from CSV)
        else if (nId === 'maternity' && isVishwaPlan) {
          const vishwaMaternityConfig = VISHWA_MATERNITY_CONFIG[coverageKey] || VISHWA_MATERNITY_CONFIG['1Cr'];
          featureCost += vishwaMaternityConfig.cost;
          explanationLines.push(`Global Maternity (Up to ${vishwaMaternityConfig.display}): +₹${vishwaMaternityConfig.cost.toLocaleString('en-IN')}`);
        }
        else {
          const fKey = Object.keys(FEATURE_COSTS).find(k => normalizeId(k) === nId);
          if (fKey) {
            featureCost += FEATURE_COSTS[fKey].cost;
            explanationLines.push(`${FEATURE_COSTS[fKey].label}: +₹${FEATURE_COSTS[fKey].cost}`);
          }
        }
        
        const rKey = Object.keys(RIDER_COSTS).find(k => normalizeId(k) === nId);
        if (rKey) {
          riderCost += RIDER_COSTS[rKey].cost;
          explanationLines.push(`${RIDER_COSTS[rKey].label}: +₹${RIDER_COSTS[rKey].cost}`);
        }
      }
    });
    } // End of else block for non-Varishtha plans

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

    // Apply room rent restriction discount for Parivar plan (fixed amount per member)
    if (isParivarPlan && roomRentDiscountPerMember > 0) {
      const memberCount = memberBreakdown.length;
      const totalRoomDiscount = roomRentDiscountPerMember * memberCount;
      discountAmount += totalRoomDiscount;
      
      // Get display name for the room type
      let roomTypeName = 'Room Rent Restriction';
      if (roomRentRestriction.toLowerCase().includes('twin')) roomTypeName = 'Twin Sharing';
      else if (roomRentRestriction.toLowerCase().includes('single private ac') || roomRentRestriction === 'single_pvt_ac') roomTypeName = 'Single Private AC';
      else if (roomRentRestriction.toLowerCase().includes('single private') || roomRentRestriction === 'single_pvt') roomTypeName = 'Single Private Room';
      
      explanationLines.push(`${roomTypeName}: -₹${roomRentDiscountPerMember} × ${memberCount} = -₹${totalRoomDiscount}`);
    }

    const netPremium = (totalBasePremium + featureCost + chronicCost + riderCost + totalOPDCost) - discountAmount;
    const gstAmount = Math.round(netPremium * GST_RATE);
    
    const finalAnnualPremium = netPremium + gstAmount;
    const totalPayable = finalAnnualPremium * tenure; 

    return {
      totalBasePremium,
      memberBreakdown,
      featureCost,
      chronicCost,
      riderCost,
      totalOPDCost,
      opdRiderSelection,
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
    totalBasePremium, memberBreakdown, featureCost, chronicCost, riderCost, totalOPDCost,
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
          
          <div className="absolute left-0 bottom-6 w-80 bg-slate-800 p-4 rounded-xl border border-slate-600 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            <p className="text-xs font-bold text-blue-300 mb-2 border-b border-slate-600 pb-2">Member Breakdown</p>
            {memberBreakdown.map((m, i) => (
              <div key={i} className="flex justify-between text-[11px] text-slate-300 mb-1.5">
                <span>{m.label} ({m.age}y)</span>
                <div className="text-right">
                  <span className="font-mono">₹{m.final.toLocaleString()}</span>
                  {m.opdCost && (
                    <span className="text-cyan-400 text-[9px] block">(+₹{m.opdCost.toLocaleString()} OPD)</span>
                  )}
                  {m.roomRentDiscount && (
                    <span className="text-green-400 text-[9px] block">(-₹{m.roomRentDiscount} room rent)</span>
                  )}
                </div>
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

        {totalOPDCost > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-cyan-400 font-medium">Worldwide OPD</span>
            <span className="font-bold text-cyan-400">₹{totalOPDCost.toLocaleString('en-IN')}</span>
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
          <span className="font-medium">₹{(totalBasePremium + featureCost + chronicCost + riderCost + (totalOPDCost || 0) - discountAmount).toLocaleString('en-IN')}</span>
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