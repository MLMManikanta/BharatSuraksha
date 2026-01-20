/**
 * VAJRA Suraksha Premium Seed Script
 * Custom Plan with age-based multipliers
 * 
 * Age Multipliers:
 * - 18-25: 1.00× (base rate)
 * - 26-35: 1.20×
 * - 36-45: 1.45×
 * - 46-50: 1.65×
 * - 51-56: 1.85×
 * - 57-64: 2.20×
 * - 65+: 2.60×
 * 
 * Coverage Options: 10L, 15L, 20L, 30L, 50L, 1Cr, 1.5Cr, 2Cr, 3Cr, 5Cr, Unlimited
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Import InsurancePlan model
const InsurancePlan = require('../models/InsurancePlan');

// VAJRA Age Multipliers
const VAJRA_AGE_MULTIPLIERS = {
  '18-25': 1.00,
  '26-35': 1.20,
  '36-45': 1.45,
  '46-50': 1.65,
  '51-56': 1.85,
  '57-64': 2.20,
  '65+': 2.60
};

// VAJRA Base Feature Costs (18-25 age group = 1.00×) from CSV
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

// VAJRA Chronic Care Rider Costs (per condition, base 18-25) from CSV
const VAJRA_CHRONIC_COSTS_BASE = {
  'diabetes': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'high_cholesterol': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'copd': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'heart_disease': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'hypertension': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 },
  'asthma': { '10L': 1170, '15L': 1390, '20L': 1550, '30L': 1820, '50L': 2290, '1Cr': 3290, '1.5Cr': 3990, '2Cr': 4640, '3Cr': 5640, '5Cr': 6930, 'Unlimited': 7980 }
};

// VAJRA Rider Costs (base 18-25) from CSV
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

// Vajra plan data
const vajraPlanData = {
  name: 'Vajra Suraksha',
  description: 'Fully customizable health insurance plan with age-based premium multipliers. Build your perfect coverage by selecting individual features, riders, and add-ons tailored to your specific needs.',
  type: 'custom',
  isCustom: true,
  category: 'health',
  
  // Coverage options
  coverageOptions: [
    { value: 1000000, label: '₹10 Lakhs', key: '10L' },
    { value: 1500000, label: '₹15 Lakhs', key: '15L' },
    { value: 2000000, label: '₹20 Lakhs', key: '20L' },
    { value: 3000000, label: '₹30 Lakhs', key: '30L' },
    { value: 5000000, label: '₹50 Lakhs', key: '50L' },
    { value: 10000000, label: '₹1 Crore', key: '1Cr' },
    { value: 15000000, label: '₹1.5 Crore', key: '1.5Cr' },
    { value: 20000000, label: '₹2 Crore', key: '2Cr' },
    { value: 30000000, label: '₹3 Crore', key: '3Cr' },
    { value: 50000000, label: '₹5 Crore', key: '5Cr' },
    { value: 999999999, label: 'Unlimited', key: 'Unlimited' }
  ],
  
  // Age multipliers
  ageMultipliers: VAJRA_AGE_MULTIPLIERS,
  
  // Entry age limits
  minEntryAge: 18,
  maxEntryAge: 65,
  
  // Tenure options
  tenureOptions: [1, 2, 3],
  tenureDiscounts: {
    '1': 0,
    '2': 5, // 5% discount
    '3': 10 // 10% discount
  },
  
  // Premium tables
  premiumTables: {
    features: VAJRA_FEATURE_COSTS_BASE,
    chronicCare: VAJRA_CHRONIC_COSTS_BASE,
    riders: VAJRA_RIDER_COSTS_BASE
  },
  
  // Available features
  features: [
    {
      id: 'hosp_mandatory',
      name: 'Hospitalisation Cover',
      description: 'Covers all hospitalization expenses including room charges, doctor fees, ICU, and medical expenses',
      category: 'core',
      isMandatory: true
    },
    {
      id: 'pre_hosp_30',
      name: 'Pre-Hospitalization (30 days)',
      description: 'Covers medical expenses incurred 30 days prior to hospitalization',
      category: 'hospitalization'
    },
    {
      id: 'pre_hosp_60',
      name: 'Pre-Hospitalization (60 days)',
      description: 'Covers medical expenses incurred 60 days prior to hospitalization',
      category: 'hospitalization'
    },
    {
      id: 'pre_hosp_90',
      name: 'Pre-Hospitalization (90 days)',
      description: 'Covers medical expenses incurred 90 days prior to hospitalization',
      category: 'hospitalization'
    },
    {
      id: 'post_hosp_60',
      name: 'Post-Hospitalization (60 days)',
      description: 'Covers medical expenses incurred 60 days after discharge',
      category: 'hospitalization'
    },
    {
      id: 'post_hosp_90',
      name: 'Post-Hospitalization (90 days)',
      description: 'Covers medical expenses incurred 90 days after discharge',
      category: 'hospitalization'
    },
    {
      id: 'post_hosp_180',
      name: 'Post-Hospitalization (180 days)',
      description: 'Covers medical expenses incurred 180 days after discharge',
      category: 'hospitalization'
    },
    {
      id: 'day_care',
      name: 'Day Care Procedures',
      description: 'Covers medical procedures that do not require 24-hour hospitalization',
      category: 'treatment'
    },
    {
      id: 'global',
      name: 'Global Coverage',
      description: 'Extends coverage to treatments availed anywhere in the world',
      category: 'coverage'
    },
    {
      id: 'non_deduct',
      name: 'Non-Deductible Items Cover',
      description: 'Covers consumables and non-medical items usually not covered',
      category: 'coverage'
    },
    {
      id: 'health_check',
      name: 'Annual Health Check-up',
      description: 'Free annual preventive health check-up for insured members',
      category: 'wellness'
    },
    {
      id: 'restore',
      name: 'Automatic Restore Benefit',
      description: 'Restores sum insured automatically if exhausted during the policy year',
      category: 'coverage'
    },
    {
      id: 'maternity_global',
      name: 'Global Maternity Cover',
      description: 'Covers maternity expenses including delivery and newborn care worldwide',
      category: 'maternity'
    },
    {
      id: 'ambulance',
      name: 'Ambulance Cover',
      description: 'Covers ambulance charges for emergency transportation',
      category: 'emergency'
    },
    {
      id: 'air_amb',
      name: 'Air Ambulance',
      description: 'Covers air ambulance charges for critical emergency evacuation',
      category: 'emergency'
    },
    {
      id: 'ncb',
      name: 'No Claim Bonus',
      description: 'Increase in sum insured for every claim-free year',
      category: 'bonus'
    },
    {
      id: 'ayush',
      name: 'AYUSH Benefits',
      description: 'Covers treatments under Ayurveda, Yoga, Unani, Siddha, and Homeopathy',
      category: 'alternative'
    },
    {
      id: 'organ',
      name: 'Organ Donor Expenses',
      description: 'Covers hospitalization expenses of organ donor during transplant',
      category: 'treatment'
    },
    {
      id: 'domiciliary',
      name: 'Domiciliary Treatment',
      description: 'Covers treatment taken at home when hospitalization is not possible',
      category: 'treatment'
    }
  ],
  
  // Available riders
  riders: [
    {
      id: 'unlimited_care',
      name: 'Unlimited Care Package',
      description: 'Enhances coverage to unlimited for specific treatments',
      category: 'coverage'
    },
    {
      id: 'inflation_shield',
      name: 'Inflation Shield',
      description: 'Automatic increase in sum insured to protect against medical inflation',
      category: 'coverage'
    },
    {
      id: 'tele_consult',
      name: 'Teleconsultation',
      description: 'Unlimited online doctor consultations throughout the policy year',
      category: 'wellness'
    },
    {
      id: 'smart_agg',
      name: 'Smart Aggregate',
      description: 'Aggregates sum insured over multi-year policies',
      category: 'coverage',
      tenureBased: true
    },
    {
      id: 'super_bonus',
      name: 'Super No Claim Bonus',
      description: 'Enhanced NCB accumulation for claim-free years',
      category: 'bonus'
    },
    {
      id: 'maternity_boost',
      name: 'Maternity Boost',
      description: 'Enhanced maternity coverage with higher limits',
      category: 'maternity'
    },
    {
      id: 'ped_wait_2y',
      name: 'PED Wait Reduction (4yr→2yr)',
      description: 'Reduces pre-existing disease waiting period from 4 years to 2 years',
      category: 'waiting_period'
    },
    {
      id: 'ped_wait_1y',
      name: 'PED Wait Reduction (4yr→1yr)',
      description: 'Reduces pre-existing disease waiting period from 4 years to 1 year',
      category: 'waiting_period'
    },
    {
      id: 'specific_wait',
      name: 'Specific Illness Wait Reduction',
      description: 'Reduces waiting period for specific illnesses from 2 years to 30 days',
      category: 'waiting_period'
    }
  ],
  
  // Chronic conditions available for coverage
  chronicConditions: [
    { id: 'diabetes', name: 'Diabetes', description: 'Type 1 and Type 2 diabetes management' },
    { id: 'high_cholesterol', name: 'High Cholesterol', description: 'Hypercholesterolemia management' },
    { id: 'copd', name: 'COPD', description: 'Chronic Obstructive Pulmonary Disease management' },
    { id: 'heart_disease', name: 'Heart Disease', description: 'Coronary artery disease management' },
    { id: 'hypertension', name: 'Hypertension', description: 'High blood pressure management' },
    { id: 'asthma', name: 'Asthma', description: 'Chronic asthma management' }
  ],
  
  // Plan status
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const seedVajraPremium = async () => {
  await connectDB();
  
  try {
    // Check if Vajra plan already exists
    const existingPlan = await InsurancePlan.findOne({ name: 'Vajra Suraksha' });
    
    if (existingPlan) {
      // Update existing plan
      await InsurancePlan.findByIdAndUpdate(existingPlan._id, vajraPlanData);
      console.log('✅ Vajra Suraksha plan updated successfully!');
    } else {
      // Create new plan
      const newPlan = new InsurancePlan(vajraPlanData);
      await newPlan.save();
      console.log('✅ Vajra Suraksha plan created successfully!');
    }
    
    // Display summary
    console.log('\n📊 VAJRA Suraksha Premium Summary:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n🎯 Age Multipliers:');
    Object.entries(VAJRA_AGE_MULTIPLIERS).forEach(([age, mult]) => {
      console.log(`   ${age}: ${mult.toFixed(2)}×`);
    });
    
    console.log('\n💰 Base Premium (Hospitalisation) for 18-25 age group:');
    Object.entries(VAJRA_FEATURE_COSTS_BASE.hosp_mandatory).forEach(([coverage, premium]) => {
      console.log(`   ${coverage}: ₹${premium.toLocaleString('en-IN')}`);
    });
    
    console.log('\n📦 Available Features:', Object.keys(VAJRA_FEATURE_COSTS_BASE).length);
    console.log('🏥 Chronic Conditions:', Object.keys(VAJRA_CHRONIC_COSTS_BASE).length);
    console.log('🎁 Riders:', Object.keys(VAJRA_RIDER_COSTS_BASE).length);
    console.log('═══════════════════════════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ Error seeding Vajra plan:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📴 MongoDB disconnected');
    process.exit(0);
  }
};

// Run the seed script
seedVajraPremium();
