const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      immutable: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    plan: {
      type: String,
      required: true,
      enum: ["Neev", "Parivar", "Vishwa", "Vajra"],
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    transactionId: {
      type: String,
      required: false,
      unique: true,
      immutable: true,
    },

    // Keep optional fields for backward compatibility
    fullName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    mobileNumber: {
      type: String,
      trim: true,
      match: [/^[+]?\d{10,15}$/, "Invalid mobile number"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
