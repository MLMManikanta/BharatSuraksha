/**
 * Seed script to update/create Varishtha Suraksha plan with age-based premium table
 * 
 * Premium Structure (Senior Citizen Plan - 60+ years only):
 * Age Groups:
 *   - 60-65
 *   - 66-70
 *   - 71-75
 *   - 76-100
 * 
 * Coverage Options: 5L, 10L, 15L, 25L, 50L
 * 
 * Rider Options:
 *   - Chronic Care Conditions (from Day 31): ₹4,032 per condition
 *   - PED Waiting Period Reduction (3yr to 1yr): ₹3,387
 *   - Specific Illness Waiting Period Reduction (2yr to 1yr): ₹5,302
 *   - Co-pay Waiver: 5% (₹1,234), 0% (₹1,934)
 *   - Non-Medical Consumables: ₹996
 *   - Room Rent Options: Any (₹1,267), Deluxe (₹967), Single Private AC (₹489)
 *   - Voluntary Deductible: 10k (₹1,568), 25k (₹3,067), 50k (₹4,998), 1L (₹8,654)
 * 
 * Run this script: node src/scripts/seedVarishthaPremium.js
 */

const mongoose = require("mongoose");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const InsurancePlan = require("../models/InsurancePlan");

// Varishtha Premium Table (Senior Citizen Plan)
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

// Varishtha Rider Costs (from CSV specification)
const VARISHTHA_RIDER_COSTS = {
  // Chronic Care Conditions Cover (from Day 31) - per condition
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
    '5%': 1234,
    '0%': 1934
  },
  // Non-Medical Consumables Cover
  consumables: 996,
  // Room Rent Upgrade Options (from Single Private Room)
  roomRent: {
    'Any Room': 1267,
    'Deluxe Room': 967,
    'Single Private AC Room': 489
  },
  // Voluntary Deductible Discounts (reduces premium)
  deductible: {
    '10k': 1568,
    '25k': 3067,
    '50k': 4998,
    '1L': 8654
  }
};

// Varishtha Plan configurations for different sum insured options
const varishthaPlanConfigs = [
  {
    planName: "Varishtha Suraksha - 5 Lakhs",
    code: "VARISHTHA-5L",
    description: "Senior citizen health insurance with ₹5 Lakh coverage. Designed for ages 60+ with reduced waiting periods and senior-specific benefits.",
    sumInsured: 500000,
    basePremium: 14136, // Base premium for 60-65 age group
  },
  {
    planName: "Varishtha Suraksha - 10 Lakhs",
    code: "VARISHTHA-10L",
    description: "Senior citizen health insurance with ₹10 Lakh coverage. Enhanced protection for ages 60+ with comprehensive senior benefits.",
    sumInsured: 1000000,
    basePremium: 18344,
  },
  {
    planName: "Varishtha Suraksha - 15 Lakhs",
    code: "VARISHTHA-15L",
    description: "Senior citizen health insurance with ₹15 Lakh coverage. Premium protection for ages 60+ with extensive senior care features.",
    sumInsured: 1500000,
    basePremium: 27516,
  },
  {
    planName: "Varishtha Suraksha - 25 Lakhs",
    code: "VARISHTHA-25L",
    description: "Senior citizen health insurance with ₹25 Lakh coverage. Comprehensive protection for ages 60+ with top-tier senior benefits.",
    sumInsured: 2500000,
    basePremium: 45860,
  },
  {
    planName: "Varishtha Suraksha - 50 Lakhs",
    code: "VARISHTHA-50L",
    description: "Premium senior citizen health insurance with ₹50 Lakh coverage. Maximum protection for ages 60+ with all senior-specific benefits.",
    sumInsured: 5000000,
    basePremium: 91720,
  }
];

const commonPlanFields = {
  currency: "INR",
  premiumTable: VARISHTHA_PREMIUM_TABLE,
  riderCosts: VARISHTHA_RIDER_COSTS,
  usesAgePremiumTable: true,
  minAge: 60,
  maxAge: 100,
  roomRentLimit: {
    type: "fixed",
    value: 10000,
    note: "Customizable room rent options available",
    upgradeOptions: [
      { name: "Single Private AC Room", cost: 489 },
      { name: "Deluxe Room", cost: 967 },
      { name: "Any Room", cost: 1267 }
    ]
  },
  coPayment: {
    type: "percent",
    value: 10,
    note: "Standard 10% copay, reducible to 5% (+₹1,234) or 0% (+₹1,934)",
    waiverOptions: [
      { level: "5%", cost: 1234 },
      { level: "0%", cost: 1934 }
    ]
  },
  chronicCareConditions: {
    coverageFromDay: 31,
    perConditionCost: 4032,
    conditions: [
      "Diabetes",
      "High Cholesterol",
      "COPD",
      "Heart Disease",
      "Hypertension",
      "Asthma"
    ]
  },
  deductibleOptions: [
    { amount: 10000, discount: 1568 },
    { amount: 25000, discount: 3067 },
    { amount: 50000, discount: 4998 },
    { amount: 100000, discount: 8654 }
  ],
  diseaseWiseLimits: [],
  waitingPeriods: {
    initialDays: 30,
    diseaseSpecific: [
      { disease: "Pre-existing diseases", days: 1095, reducedDays: 365, reductionCost: 3387 },
      { disease: "Specific illnesses", days: 730, reducedDays: 365, reductionCost: 5302 }
    ],
    maternityDays: null // Not applicable for senior plan
  },
  consumablesCover: {
    available: true,
    cost: 996,
    note: "Covers 60+ non-medical consumable items"
  },
  preHospitalizationDays: 60,
  postHospitalizationDays: 90,
  restorationBenefit: "unrelated",
  dayCareCoverage: true,
  noClamBonus: {
    type: "percentage",
    value: 10,
    note: "10% increase in sum insured for each claim-free year"
  },
  features: [
    "Tele-OPD Consultations",
    "Pre-existing Disease Cover (Reducible to 1 Year)",
    "Chronic Care Conditions Cover (from Day 31)",
    "Customizable Room Rent Options",
    "Voluntary Deductible Options",
    "Co-pay Waiver Options",
    "Non-Medical Consumables Cover",
    "Annual Health Checkup",
    "Day Care Procedures",
    "Domiciliary Hospitalization",
    "AYUSH Treatment",
    "Organ Donor Expenses",
    "Ambulance Cover",
    "No Claim Bonus",
    "Lifelong Renewal"
  ],
  tags: ["varishtha", "senior", "60+", "elderly", "age-based-premium"],
  isActive: true
};

async function seedVarishthaPlans() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/bharat_suraksha";
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");

    for (const config of varishthaPlanConfigs) {
      const planData = { ...config, ...commonPlanFields };
      
      // Check if plan already exists
      const existingPlan = await InsurancePlan.findOne({ code: config.code });
      
      if (existingPlan) {
        // Update existing plan
        console.log(`Updating existing plan: ${config.planName}`);
        await InsurancePlan.findByIdAndUpdate(existingPlan._id, planData, { new: true });
        console.log(`✅ Updated: ${config.planName}`);
      } else {
        // Create new plan
        console.log(`Creating new plan: ${config.planName}`);
        await InsurancePlan.create(planData);
        console.log(`✅ Created: ${config.planName}`);
      }
    }

    console.log("\n========================================");
    console.log("Varishtha Suraksha Plans Summary:");
    console.log("========================================");
    console.log("Target Age: 60+ years (Senior Citizens)");
    console.log("Coverage Options: 5L, 10L, 15L, 25L, 50L");
    console.log("\nAge Brackets:");
    console.log("  - 60-65 years");
    console.log("  - 66-70 years");
    console.log("  - 71-75 years");
    console.log("  - 76-100 years");
    console.log("\nRider Options:");
    console.log("  - Chronic Care Conditions: ₹4,032/condition");
    console.log("  - PED Reduction (3yr→1yr): ₹3,387");
    console.log("  - Specific Illness Reduction: ₹5,302");
    console.log("  - Co-pay Waiver: 5% (₹1,234), 0% (₹1,934)");
    console.log("  - Non-Medical Consumables: ₹996");
    console.log("  - Room Rent: Any (₹1,267), Deluxe (₹967), AC (₹489)");
    console.log("  - Deductible: 10k (-₹1,568) to 1L (-₹8,654)");
    console.log("\nKey Features:");
    console.log("  - Standard 10% Co-pay (waivable)");
    console.log("  - Tele-OPD Consultations");
    console.log("  - Lifelong Renewal");
    console.log("========================================\n");

    console.log("Varishtha Suraksha seed completed successfully!");

  } catch (error) {
    console.error("Error seeding Varishtha plans:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run if executed directly
if (require.main === module) {
  seedVarishthaPlans()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedVarishthaPlans, VARISHTHA_PREMIUM_TABLE, VARISHTHA_RIDER_COSTS };
