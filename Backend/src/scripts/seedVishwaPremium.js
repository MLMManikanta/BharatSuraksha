/**
 * Seed script to update/create Vishwa Suraksha plan with age-based premium table
 * 
 * Premium Structure (as per Vishwa_Suraksha_Premium_Model.csv):
 * Age Groups:
 *   - Below 18 years
 *   - 18-22, 23-27, 28-32, 33-37, 38-42, 43-47, 48-52, 53-57, 58-62, 63-67, 68-70
 *   - Above 70 years
 * 
 * Coverage Options: 50L, 1Cr, 2Cr, 5Cr, Unlimited (99Cr)
 * 
 * Maternity Cover Limits:
 *   - ₹1L for 50L SI
 *   - ₹2L for 1Cr/2Cr SI
 *   - ₹2.5L for 5Cr/Unlimited SI
 * 
 * OPD Options: 25k, 50k, 75k, 1L (age-based pricing)
 * 
 * Run this script: node src/scripts/seedVishwaPremium.js
 */

const mongoose = require("mongoose");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const InsurancePlan = require("../models/InsurancePlan");

// Vishwa Premium Table from CSV (per person per annum)
const VISHWA_PREMIUM_TABLE = {
  '50L': { 
    'below18': 65800, '18-22': 67800, '23-27': 73224, '28-32': 78648, 
    '33-37': 84750, '38-42': 91530, '43-47': 101699, '48-52': 115261, 
    '53-57': 132210, '58-62': 152550, '63-67': 176280, '68-70': 203400, 'above70': 206400 
  },
  '1Cr': { 
    'below18': 78512, '18-22': 80512, '23-27': 86954, '28-32': 93394, 
    '33-37': 100641, '38-42': 108691, '43-47': 120768, '48-52': 136872, 
    '53-57': 156999, '58-62': 181154, '63-67': 209332, '68-70': 241538, 'above70': 244538 
  },
  '2Cr': { 
    'below18': 99700, '18-22': 101700, '23-27': 109836, '28-32': 117972, 
    '33-37': 127126, '38-42': 137294, '43-47': 152549, '48-52': 172891, 
    '53-57': 198314, '58-62': 228826, '63-67': 264420, '68-70': 305100, 'above70': 308100 
  },
  '5Cr': { 
    'below18': 133600, '18-22': 135600, '23-27': 146448, '28-32': 157296, 
    '33-37': 169501, '38-42': 183059, '43-47': 203398, '48-52': 230522, 
    '53-57': 264419, '58-62': 305101, '63-67': 352560, '68-70': 406800, 'above70': 409800 
  },
  'Unlimited': { 
    'below18': 159025, '18-22': 161025, '23-27': 173907, '28-32': 186789, 
    '33-37': 201282, '38-42': 217383, '43-47': 241536, '48-52': 273744, 
    '53-57': 313998, '58-62': 362307, '63-67': 418665, '68-70': 483075, 'above70': 486075 
  }
};

// Vishwa Base Premium (without specific SI selection) from CSV
const VISHWA_BASE_PREMIUM = {
  'below18': 40375, '18-22': 42375, '23-27': 45765, '28-32': 49155, 
  '33-37': 52969, '38-42': 57206, '43-47': 63562, '48-52': 72038, 
  '53-57': 82631, '58-62': 95344, '63-67': 110175, '68-70': 127125, 'above70': 130125
};

// Vishwa OPD Rider Options from CSV (per person per annum)
const VISHWA_OPD_OPTIONS = {
  '25k': { 
    'below18': 15000, '18-22': 17000, '23-27': 18360, '28-32': 19720, 
    '33-37': 21250, '38-42': 22950, '43-47': 25500, '48-52': 28900, 
    '53-57': 33150, '58-62': 38250, '63-67': 44200, '68-70': 51000, 'above70': 54000 
  },
  '50k': { 
    'below18': 27000, '18-22': 29000, '23-27': 31320, '28-32': 33640, 
    '33-37': 36250, '38-42': 39150, '43-47': 43500, '48-52': 49300, 
    '53-57': 56550, '58-62': 65250, '63-67': 75400, '68-70': 87000, 'above70': 90000 
  },
  '75k': { 
    'below18': 40000, '18-22': 42000, '23-27': 45360, '28-32': 48720, 
    '33-37': 52500, '38-42': 56700, '43-47': 63000, '48-52': 71400, 
    '53-57': 81900, '58-62': 94500, '63-67': 109200, '68-70': 126000, 'above70': 129000 
  },
  '1L': { 
    'below18': 49000, '18-22': 51000, '23-27': 55080, '28-32': 59160, 
    '33-37': 63750, '38-42': 68850, '43-47': 76500, '48-52': 86700, 
    '53-57': 99450, '58-62': 114750, '63-67': 132600, '68-70': 153000, 'above70': 156000 
  }
};

// Maternity Cover Limits based on Sum Insured (from CSV)
const VISHWA_MATERNITY_CONFIG = {
  '50L': { limit: 100000, display: '₹1,00,000' },
  '1Cr': { limit: 200000, display: '₹2,00,000' },
  '2Cr': { limit: 200000, display: '₹2,00,000' },
  '5Cr': { limit: 250000, display: '₹2,50,000' },
  'Unlimited': { limit: 250000, display: '₹2,50,000' }
};

// Vishwa Plan configurations for different sum insured options
const vishwaPlanConfigs = [
  {
    planName: "Vishwa Suraksha - 50 Lakhs",
    code: "VISHWA-50L",
    description: "Premium global health insurance with ₹50 Lakh worldwide coverage. Includes global cashless hospitalization, international air ambulance, and maternity cover up to ₹1 Lakh.",
    sumInsured: 5000000,
    basePremium: 67800, // Base premium for 18-22 age group
    maternityLimit: 100000
  },
  {
    planName: "Vishwa Suraksha - 1 Crore",
    code: "VISHWA-1CR",
    description: "Premium global health insurance with ₹1 Crore worldwide coverage. Includes global cashless hospitalization, international air ambulance, and maternity cover up to ₹2 Lakhs.",
    sumInsured: 10000000,
    basePremium: 80512,
    maternityLimit: 200000
  },
  {
    planName: "Vishwa Suraksha - 2 Crores",
    code: "VISHWA-2CR",
    description: "Premium global health insurance with ₹2 Crore worldwide coverage. Includes global cashless hospitalization, international air ambulance, and maternity cover up to ₹2 Lakhs.",
    sumInsured: 20000000,
    basePremium: 101700,
    maternityLimit: 200000
  },
  {
    planName: "Vishwa Suraksha - 5 Crores",
    code: "VISHWA-5CR",
    description: "Elite global health insurance with ₹5 Crore worldwide coverage. Includes global cashless hospitalization, international air ambulance, and maternity cover up to ₹2.5 Lakhs.",
    sumInsured: 50000000,
    basePremium: 135600,
    maternityLimit: 250000
  },
  {
    planName: "Vishwa Suraksha - Unlimited",
    code: "VISHWA-UNLIMITED",
    description: "Ultimate global health insurance with unlimited (₹99 Crore) worldwide coverage. Includes global cashless hospitalization, international air ambulance, and maternity cover up to ₹2.5 Lakhs.",
    sumInsured: 990000000,
    basePremium: 161025,
    maternityLimit: 250000
  }
];

const commonPlanFields = {
  currency: "INR",
  premiumTable: VISHWA_PREMIUM_TABLE,
  basePremiumTable: VISHWA_BASE_PREMIUM,
  opdOptions: VISHWA_OPD_OPTIONS,
  maternityConfig: VISHWA_MATERNITY_CONFIG,
  usesAgePremiumTable: true,
  roomRentLimit: {
    type: "any_room",
    value: 0,
    note: "No room rent restriction - Any room covered"
  },
  coPayment: {
    type: "none",
    value: 0
  },
  globalCoverage: true,
  coverageCountries: ["Worldwide including USA & Canada"],
  diseaseWiseLimits: [],
  waitingPeriods: {
    initialDays: 30,
    diseaseSpecific: [
      { disease: "Pre-existing diseases", days: 1095 }, // 3 years
      { disease: "Specific slow-growing illnesses", days: 730 } // 24 months
    ],
    maternityDays: 730 // 2 years
  },
  preHospitalizationDays: 90,
  postHospitalizationDays: 180,
  restorationBenefit: "unlimited",
  dayCareCoverage: true,
  renewalBonus: {
    type: "percentage",
    value: 500,
    note: "5x Renewal Bonus - Sum Insured grows up to 500% over time"
  },
  features: [
    "Global Cashless Hospitalization",
    "International Air Ambulance",
    "100% Non-Medical Consumables Coverage",
    "0% Co-Pay Worldwide",
    "Lifelong Renewal",
    "AYUSH Benefits",
    "Organ Donor Expenses",
    "Domiciliary Expenses",
    "Day Care Procedures"
  ],
  tags: ["vishwa", "global", "premium", "elite", "international", "worldwide", "age-based-premium"],
  isActive: true
};

async function seedVishwaPlans() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/bharat_suraksha";
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");

    for (const config of vishwaPlanConfigs) {
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
    console.log("Vishwa Suraksha Plans Summary:");
    console.log("========================================");
    console.log("Coverage Options: 50L, 1Cr, 2Cr, 5Cr, Unlimited");
    console.log("\nMaternity Limits:");
    console.log("  - 50L:       ₹1,00,000");
    console.log("  - 1Cr/2Cr:   ₹2,00,000");
    console.log("  - 5Cr/Unlim: ₹2,50,000");
    console.log("\nOPD Rider Options: ₹25k, ₹50k, ₹75k, ₹1L");
    console.log("========================================\n");

    console.log("Vishwa Suraksha seed completed successfully!");

  } catch (error) {
    console.error("Error seeding Vishwa plans:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run if executed directly
if (require.main === module) {
  seedVishwaPlans()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedVishwaPlans, VISHWA_PREMIUM_TABLE, VISHWA_OPD_OPTIONS, VISHWA_MATERNITY_CONFIG };
