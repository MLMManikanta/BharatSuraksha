const mongoose = require("mongoose");

const insurancePlanSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    sumInsured: {
      type: Number,
      required: true,
      min: 0,
    },
    basePremium: {
      type: Number,
      required: true,
      min: 0,
    },
    // Age-based premium table for plans like Neev Suraksha
    // Structure: { "3L": { "0-35": 4500, "36-50": 5600, "51-100": 7800 }, ... }
    premiumTable: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    // Flag to indicate if this plan uses age-based premium calculation
    usesAgePremiumTable: {
      type: Boolean,
      default: false,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: "INR",
      match: [/^[A-Z]{3}$/, "Invalid currency code"],
    },
    roomRentLimit: {
      type: {
        type: String,
        enum: [
          "fixed",
          "percent_sum_insured",
          "single_private_ac",
          "deluxe",
          "any_room",
        ],
        required: true,
        default: "fixed",
      },
      value: {
        type: Number,
        min: 0,
        default: 5000,
      },
      note: {
        type: String,
        trim: true,
        maxlength: 120,
      },
    },
    coPayment: {
      type: {
        type: String,
        enum: ["none", "percent", "fixed"],
        default: "none",
      },
      value: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    diseaseWiseLimits: {
      type: [
        {
          disease: { type: String, required: true, trim: true },
          limitAmount: { type: Number, min: 0 },
          limitPercent: { type: Number, min: 0, max: 100 },
          notes: { type: String, trim: true, maxlength: 200 },
        },
      ],
      default: [],
    },
    waitingPeriods: {
      initialDays: { type: Number, min: 0, default: 0 },
      diseaseSpecific: {
        type: [
          {
            disease: { type: String, required: true, trim: true },
            days: { type: Number, min: 0, required: true },
          },
        ],
        default: [],
      },
      maternityDays: { type: Number, min: 0, default: 0 },
    },
    // Maternity coverage limits based on sum insured for Parivar Suraksha
    // Structure: { sumInsuredKey -> limit }
    maternityLimits: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        '10L': 75000,
        '15L': 75000,
        '20L': 100000,
        '25L': 100000,
        '50L': 200000,
        '1Cr': 200000
      }
    },
    // Flag to indicate maternity requires both self and spouse
    maternityRequiresSelfAndSpouse: {
      type: Boolean,
      default: true
    },
    preHospitalizationDays: { type: Number, min: 0, default: 0 },
    postHospitalizationDays: { type: Number, min: 0, default: 0 },
    restorationBenefit: {
      type: String,
      enum: ["related", "unrelated", "both", "none"],
      default: "none",
    },
    dayCareCoverage: { type: Boolean, default: false },
    
    // Riders configuration for this plan
    // Structure: Array of rider definitions with costs, eligibility rules
    riders: {
      type: [{
        riderId: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        icon: { type: String, trim: true },
        // Cost can be fixed, percentage of premium, or lookup table
        costType: {
          type: String,
          enum: ['fixed', 'percentage', 'table', 'age_based'],
          default: 'fixed'
        },
        // Fixed cost amount
        fixedCost: { type: Number, min: 0, default: 0 },
        // Percentage of base premium
        percentageCost: { type: Number, min: 0, max: 100, default: 0 },
        // Cost lookup table by coverage key
        // Structure: { "10L": 500, "15L": 600, ... }
        costTable: { type: mongoose.Schema.Types.Mixed, default: {} },
        // Age-based cost multipliers
        // Structure: { "18-25": 1.0, "26-35": 1.2, ... }
        ageMultipliers: { type: mongoose.Schema.Types.Mixed, default: {} },
        // Whether rider is enabled by default
        defaultEnabled: { type: Boolean, default: false },
        // Whether rider can be toggled by user
        isOptional: { type: Boolean, default: true },
        // Eligibility conditions
        eligibility: {
          minAge: { type: Number, default: 0 },
          maxAge: { type: Number, default: 100 },
          requiredFeatures: [String],  // Features that must be active
          excludedFeatures: [String],  // Features that must be inactive
          applicableCoverages: [String] // Coverage keys where this rider is available
        },
        // Display order
        sortOrder: { type: Number, default: 0 }
      }],
      default: []
    },
    
    // Features/Benefits configuration for this plan
    features: {
      type: [{
        featureId: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        icon: { type: String, trim: true },
        // Cost can be fixed, table-based, or age-based
        costType: {
          type: String,
          enum: ['included', 'fixed', 'table', 'age_based'],
          default: 'included'
        },
        fixedCost: { type: Number, min: 0, default: 0 },
        costTable: { type: mongoose.Schema.Types.Mixed, default: {} },
        ageMultipliers: { type: mongoose.Schema.Types.Mixed, default: {} },
        defaultEnabled: { type: Boolean, default: true },
        isLocked: { type: Boolean, default: false }, // Cannot be disabled by user
        sortOrder: { type: Number, default: 0 }
      }],
      default: []
    },
    
    // Chronic conditions coverage for this plan
    chronicConditions: {
      type: [{
        conditionId: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        costPerCondition: { type: Number, min: 0, default: 0 },
        costTable: { type: mongoose.Schema.Types.Mixed, default: {} },
        ageMultipliers: { type: mongoose.Schema.Types.Mixed, default: {} },
        waitingPeriodDays: { type: Number, default: 31 }
      }],
      default: []
    },
    
    // Flag to indicate this is a customizable plan (like Vajra)
    isCustomizable: {
      type: Boolean,
      default: false
    },
    
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InsurancePlan", insurancePlanSchema);
