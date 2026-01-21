const mongoose = require("mongoose");

const heightWeightMemberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
  },
  heightFeet: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  heightInches: {
    type: Number,
    required: true,
    min: 0,
    max: 11,
  },
  weight: {
    type: Number,
    required: true,
    min: 1,
    max: 500,
  },
});

const medicalConditionMemberSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const medicalInfoSchema = new mongoose.Schema(
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
    heightWeightMembers: {
      type: [heightWeightMemberSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one member's height and weight is required",
      },
    },
    illnessMembers: {
      type: [medicalConditionMemberSchema],
      default: [],
    },
    conditionsMembers: {
      type: [medicalConditionMemberSchema],
      default: [],
    },
    lifestyleMembers: {
      type: [medicalConditionMemberSchema],
      default: [],
    },
    acceptDeclaration: {
      type: Boolean,
      required: true,
      default: false,
    },
    correctnessDeclaration: {
      type: Boolean,
      required: true,
      default: false,
    },
    planData: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["pending", "under-review", "approved", "rejected", "additional-info-required"],
      default: "pending",
    },
    reviewNotes: {
      type: String,
      trim: true,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
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
medicalInfoSchema.index({ userId: 1 });
medicalInfoSchema.index({ kycId: 1 });
medicalInfoSchema.index({ status: 1 });

module.exports = mongoose.model("MedicalInfo", medicalInfoSchema);
