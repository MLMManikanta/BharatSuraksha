const mongoose = require("mongoose");

const planCustomizationOptionSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InsurancePlan",
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-_]+$/, "Invalid option key"],
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    type: {
      type: String,
      required: true,
      enum: ["boolean", "number", "select"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    required: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    step: {
      type: Number,
      min: 0,
    },
    options: {
      type: [
        {
          label: { type: String, required: true, trim: true, maxlength: 120 },
          value: { type: String, required: true, trim: true, maxlength: 120 },
          priceDelta: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    priceImpact: {
      type: {
        type: String,
        enum: ["flat", "percent"],
        default: "flat",
      },
      value: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

planCustomizationOptionSchema.index({ plan: 1, key: 1 }, { unique: true });

module.exports = mongoose.model(
  "PlanCustomizationOption",
  planCustomizationOptionSchema
);
