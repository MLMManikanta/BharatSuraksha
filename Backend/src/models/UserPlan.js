const mongoose = require("mongoose");

const selectedAddOnSchema = new mongoose.Schema(
  {
    addOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanCustomization",
      required: true,
    },
    priceImpact: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const userPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePlan",
      required: true,
      index: true,
    },
    selectedAddOns: {
      type: [selectedAddOnSchema],
      default: [],
    },
    finalPremium: {
      type: Number,
      required: true,
      min: 0,
    },
    customizationSummary: {
      type: Object,
      default: {},
    },
    planStatus: {
      type: String,
      enum: ["draft", "active", "expired"],
      default: "draft",
    },
    policyStartDate: {
      type: Date,
    },
    policyEndDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !this.policyStartDate || !value || value >= this.policyStartDate;
        },
        message: "policyEndDate must be greater than or equal to policyStartDate",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPlan", userPlanSchema);
