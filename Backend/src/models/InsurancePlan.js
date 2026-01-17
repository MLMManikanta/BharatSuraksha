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
    preHospitalizationDays: { type: Number, min: 0, default: 0 },
    postHospitalizationDays: { type: Number, min: 0, default: 0 },
    restorationBenefit: {
      type: String,
      enum: ["related", "unrelated", "both", "none"],
      default: "none",
    },
    dayCareCoverage: { type: Boolean, default: false },
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
