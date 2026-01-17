const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    claimType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Hospitalization",
        "Pre-Post Hospitalization",
        "Preventive Health Check-up",
        "Dental",
      ],
    },
    claimCycle: {
      type: String,
      required: true,
      trim: true,
    },
    dependentId: {
      type: String,
      required: true,
      trim: true,
    },
    dayCare: {
      type: String,
      required: true,
      enum: ["Yes", "No"],
    },
    admissionDate: { type: Date, required: true },
    dischargeDate: { type: Date, required: true },
    mobile: {
      type: String,
      required: true,
      trim: true,
      match: [/^[+]?\d{10,15}$/, "Invalid mobile number"],
    },
    hospitalAddress: { type: String, required: true, trim: true },
    diagnosis: { type: String, required: true, trim: true },
    dropboxLocation: { type: String, trim: true },
    claimedAmount: { type: Number, required: true, min: 1 },
    remarks: { type: String, trim: true, maxlength: 1000 },
    consentSummary: { type: Boolean, required: true },
    consentTerms: { type: Boolean, required: true },
    hospitalizationType: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Claim", claimSchema);
