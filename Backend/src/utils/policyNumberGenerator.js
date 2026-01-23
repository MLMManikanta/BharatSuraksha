const User = require("../models/User");

// Exact 4-letter mapping as requested
const PLAN_CODES = {
  Neev: "NEEV",
  Parivar: "PARI",
  Vishwa: "VISH",
  Vajra: "VAJR",
};

function generatePolicyNumberSync(plan) {
  if (!PLAN_CODES[plan]) {
    throw new Error("Invalid plan selected");
  }
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `BS-${PLAN_CODES[plan]}-${year}-${randomDigits}`;
}

function generateTransactionIdSync() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TXN-${randomPart}`;
}

async function generateUniquePolicyNumber(plan, { maxAttempts = 10 } = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = generatePolicyNumberSync(plan);
    const exists = await User.findOne({ policyNumber: candidate }).lean().exec();
    if (!exists) return candidate;
  }
  throw new Error("Failed to generate a unique policy number after multiple attempts");
}

async function generateUniqueTransactionId({ maxAttempts = 10 } = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = generateTransactionIdSync();
    const exists = await User.findOne({ transactionId: candidate }).lean().exec();
    if (!exists) return candidate;
  }
  throw new Error("Failed to generate a unique transaction id after multiple attempts");
}

module.exports = {
  generatePolicyNumberSync,
  generateUniquePolicyNumber,
  generateTransactionIdSync,
  generateUniqueTransactionId,
  PLAN_CODES,
};
