const mongoose = require("mongoose");

const selectedOptionSchema = new mongoose.Schema(
  {
    option: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanCustomizationOption",
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    priceDelta: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const userSelectedPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePlan",
      required: true,
      index: true,
    },
    selectedOptions: {
      type: [selectedOptionSchema],
      default: [],
      validate: {
        validator: function (value) {
          return Array.isArray(value);
        },
        message: "selectedOptions must be an array",
      },
    },
    basePremium: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPremium: {
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
    status: {
      type: String,
      enum: ["draft", "active", "expired", "cancelled"],
      default: "draft",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.startDate || !value || value >= this.startDate;
        },
        message: "endDate must be greater than or equal to startDate",
      },
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSelectedPlan", userSelectedPlanSchema);
