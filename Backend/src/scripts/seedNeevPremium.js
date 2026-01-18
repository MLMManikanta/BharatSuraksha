/**
 * Seed script to update/create Neev Suraksha plan with age-based premium table
 * 
 * Premium Structure (as per Neev_Premium.csv):
 * Age Groups:
 *   - 0-35 (91 Days to 35 years)
 *   - 36-50
 *   - 51-100
 * 
 * Coverage Options: 3L, 4L, 5L
 * 
 * Run this script: node src/scripts/seedNeevPremium.js
 */

const mongoose = require("mongoose");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const InsurancePlan = require("../models/InsurancePlan");

// Neev Premium Table from CSV
const NEEV_PREMIUM_TABLE = {
  "3L": { "0-35": 4500, "36-50": 5600, "51-100": 7800 },
  "4L": { "0-35": 6600, "36-50": 7700, "51-100": 9900 },
  "5L": { "0-35": 7500, "36-50": 8600, "51-100": 10800 }
};

// Neev Plan configurations for different sum insured options
const neevPlanConfigs = [
  {
    planName: "Neev Suraksha - 3 Lakhs",
    code: "NEEV-3L",
    description: "Basic health insurance plan with ₹3 Lakh coverage. Affordable protection for individuals and families with age-based premium.",
    sumInsured: 300000,
    basePremium: 4500, // Base premium for youngest age group
  },
  {
    planName: "Neev Suraksha - 4 Lakhs",
    code: "NEEV-4L",
    description: "Basic health insurance plan with ₹4 Lakh coverage. Enhanced protection with age-based premium structure.",
    sumInsured: 400000,
    basePremium: 6600,
  },
  {
    planName: "Neev Suraksha - 5 Lakhs",
    code: "NEEV-5L",
    description: "Basic health insurance plan with ₹5 Lakh coverage. Comprehensive basic protection with age-based premium.",
    sumInsured: 500000,
    basePremium: 7500,
  }
];

const commonPlanFields = {
  currency: "INR",
  premiumTable: NEEV_PREMIUM_TABLE,
  usesAgePremiumTable: true,
  roomRentLimit: {
    type: "fixed",
    value: 5000,
    note: "Room rent limit per day"
  },
  coPayment: {
    type: "none",
    value: 0
  },
  diseaseWiseLimits: [],
  waitingPeriods: {
    initialDays: 30,
    diseaseSpecific: [
      { disease: "Pre-existing diseases", days: 730 },
      { disease: "Specific illnesses", days: 365 }
    ],
    maternityDays: 730
  },
  preHospitalizationDays: 30,
  postHospitalizationDays: 60,
  restorationBenefit: "unrelated",
  dayCareCoverage: true,
  tags: ["neev", "basic", "individual", "affordable", "age-based-premium"],
  isActive: true
};

async function seedNeevPlans() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/bharat_suraksha";
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");

    for (const config of neevPlanConfigs) {
      const planData = { ...config, ...commonPlanFields };
      
      // Check if plan already exists
      const existingPlan = await InsurancePlan.findOne({ code: config.code });
      
      if (existingPlan) {
        // Update existing plan
        console.log(`Updating existing plan: ${config.planName}`);
        await InsurancePlan.findByIdAndUpdate(existingPlan._id, planData, {
          new: true,
          runValidators: true
        });
        console.log(`✓ Updated: ${config.planName}`);
      } else {
        // Create new plan
        console.log(`Creating new plan: ${config.planName}`);
        await InsurancePlan.create(planData);
        console.log(`✓ Created: ${config.planName}`);
      }
    }

    // Also update any generic "Neev Suraksha" plan if it exists
    const genericNeevPlan = await InsurancePlan.findOne({
      $or: [
        { planName: /neev/i },
        { code: /neev/i }
      ],
      code: { $nin: ["NEEV-3L", "NEEV-4L", "NEEV-5L"] }
    });

    if (genericNeevPlan) {
      console.log(`\nUpdating generic Neev plan: ${genericNeevPlan.planName}`);
      await InsurancePlan.findByIdAndUpdate(genericNeevPlan._id, {
        premiumTable: NEEV_PREMIUM_TABLE,
        usesAgePremiumTable: true,
        tags: [...new Set([...(genericNeevPlan.tags || []), "neev", "age-based-premium"])]
      });
      console.log(`✓ Updated generic Neev plan with premium table`);
    }

    console.log("\n========================================");
    console.log("Neev Premium Table Summary:");
    console.log("========================================");
    console.log("| Coverage | Age 0-35 | Age 36-50 | Age 51-100 |");
    console.log("|----------|----------|-----------|------------|");
    console.log(`| 3 Lakhs  | ₹${NEEV_PREMIUM_TABLE["3L"]["0-35"]}    | ₹${NEEV_PREMIUM_TABLE["3L"]["36-50"]}     | ₹${NEEV_PREMIUM_TABLE["3L"]["51-100"]}      |`);
    console.log(`| 4 Lakhs  | ₹${NEEV_PREMIUM_TABLE["4L"]["0-35"]}    | ₹${NEEV_PREMIUM_TABLE["4L"]["36-50"]}     | ₹${NEEV_PREMIUM_TABLE["4L"]["51-100"]}      |`);
    console.log(`| 5 Lakhs  | ₹${NEEV_PREMIUM_TABLE["5L"]["0-35"]}    | ₹${NEEV_PREMIUM_TABLE["5L"]["36-50"]}     | ₹${NEEV_PREMIUM_TABLE["5L"]["51-100"]}     |`);
    console.log("========================================\n");

    console.log("✅ Neev Suraksha plans seeded successfully!");

  } catch (error) {
    console.error("Error seeding Neev plans:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run if called directly
if (require.main === module) {
  seedNeevPlans();
}

module.exports = { seedNeevPlans, NEEV_PREMIUM_TABLE };
