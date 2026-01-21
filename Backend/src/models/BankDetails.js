const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    kycId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KYC",
      required: false,
    },
    medicalInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalInfo",
      required: false,
    },
    paymentFrequency: {
      type: String,
      required: true,
      enum: ["monthly", "quarterly", "halfyearly", "yearly"],
    },
    // Payment calculations
    basePremium: {
      type: Number,
      required: false,
    },
    discountRate: {
      type: Number,
      required: false,
    },
    discountAmount: {
      type: Number,
      required: false,
    },
    discountedTotal: {
      type: Number,
      required: false,
    },
    perPaymentAmount: {
      type: Number,
      required: false,
    },
    paymentsPerYear: {
      type: Number,
      required: false,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{9,18}$/, "Invalid account number (must be 9-18 digits)"],
    },
    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"],
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    branchName: {
      type: String,
      required: false,
      trim: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ["Savings", "Current", "Business"],
      default: "Savings",
    },
    termsAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },
    planData: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
bankDetailsSchema.index({ userId: 1 });
bankDetailsSchema.index({ kycId: 1 });
bankDetailsSchema.index({ medicalInfoId: 1 });
bankDetailsSchema.index({ status: 1 });
bankDetailsSchema.index({ accountNumber: 1 });

module.exports = mongoose.model("BankDetails", bankDetailsSchema);
