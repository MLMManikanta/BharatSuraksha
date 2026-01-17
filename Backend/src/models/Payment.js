const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    selectedPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSelectedPlan",
      required: true,
      index: true,
    },
    amount: {
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
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    provider: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    providerPaymentId: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    paidAt: {
      type: Date,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
