const mongoose = require("mongoose");

const planCustomizationSchema = new mongoose.Schema(
  {
    addOnName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    priceImpact: {
      type: Number,
      required: true,
      min: 0,
    },
    impactType: {
      type: String,
      required: true,
      enum: [
        "increaseSumInsured",
        "reduceWaiting",
        "roomUpgrade",
        "copayReduction",
        "addDayCare",
        "other",
      ],
    },
    applicablePlans: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "InsurancePlan",
        },
      ],
      default: [],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "At least one applicable plan is required",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlanCustomization", planCustomizationSchema);
