const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
  calculatedAge: {
    type: Number,
  },
  ageUnit: {
    type: String,
    enum: ["years", "months"],
    default: "years",
  },
  ageInYears: {
    type: Number,
  },
  originalAge: {
    type: Number,
  },
});

const addressSchema = new mongoose.Schema({
  house: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{6}$/, "Invalid pincode"],
  },
});

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, "Invalid mobile number"],
  },
  emergencyContact: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, "Invalid emergency contact"],
  },
});

const proposerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 120,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  maritalStatus: {
    type: String,
    required: true,
    enum: ["Single", "Married", "Divorced", "Widowed"],
  },
  occupation: {
    type: String,
    required: true,
    trim: true,
  },
  panCard: {
    type: String,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card number"],
  },
  noPAN: {
    type: Boolean,
    default: false,
  },
});

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    proposer: {
      type: proposerSchema,
      required: true,
    },
    members: {
      type: [memberSchema],
      required: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    contact: {
      type: contactSchema,
      required: true,
    },
    ageValidation: {
      hasMismatch: {
        type: Boolean,
        default: false,
      },
      messages: {
        type: [String],
        default: [],
      },
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
  },
  { timestamps: true }
);

// Index for efficient queries
kycSchema.index({ userId: 1 });
kycSchema.index({ status: 1 });
kycSchema.index({ "contact.email": 1 });

module.exports = mongoose.model("KYC", kycSchema);
