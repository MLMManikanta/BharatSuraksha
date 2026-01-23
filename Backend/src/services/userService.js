const User = require("../models/User");
const {
  generateUniquePolicyNumber,
  generateUniqueTransactionId,
} = require("../utils/policyNumberGenerator");

const createUser = async ({
  fullName,
  email,
  mobileNumber,
  password,
  role,
  policyNumber,
  planName,
  transactionId,
}) => {
  console.log("DATA RECEIVED IN SERVICE:", { fullName, email, mobileNumber, policyNumber, role, planName });

  // If caller didn't supply a policy number but provided a plan, generate one
  let finalPolicyNumber = policyNumber;
  if (!finalPolicyNumber && planName) {
    finalPolicyNumber = await generateUniquePolicyNumber(planName);
  }

  // If caller supplied a transactionId, use it; otherwise generate a unique one
  let finalTransactionId = transactionId;
  if (!finalTransactionId) {
    finalTransactionId = await generateUniqueTransactionId();
  }

  // Build create payload with minimal required fields plus any optional ones provided
  const payload = {
    policyNumber: finalPolicyNumber,
    transactionId: finalTransactionId,
    password,
    plan: planName,
  };
  if (fullName) payload.fullName = fullName;
  if (email) payload.email = email;
  if (mobileNumber) payload.mobileNumber = mobileNumber;
  if (role) payload.role = role;

  const user = await User.create(payload);
  console.log("USER AFTER CREATE:", user ? { id: user._id, policyNumber: user.policyNumber, plan: user.plan } : null);
  return user;
};

const attachPolicyToUser = async (userId, { policyNumber, planName, transactionId }) => {
  if (!userId) throw new Error('userId is required');

  const updates = {};
  if (policyNumber) updates.policyNumber = String(policyNumber).toUpperCase().trim();
  if (planName) updates.plan = planName;
  if (transactionId) updates.transactionId = transactionId;
  updates.policyStatus = 'ACTIVE';
  updates.isProfileComplete = true;
  updates.hasActivePolicy = true;

  // derive basic policyDetails (coverage and validity) from planName — defaults used
  const coverageMap = {
    Neev: 200000,
    Parivar: 500000,
    Vishwa: 1000000,
    Vajra: 1500000,
  };
  const coverageLimit = coverageMap[planName] || 500000;
  const now = new Date();
  const validityFrom = now.toISOString().slice(0, 10);
  const nextYear = new Date(now);
  nextYear.setFullYear(now.getFullYear() + 1);
  const validityTo = nextYear.toISOString().slice(0, 10);

  updates.policyDetails = {
    policyNumber: updates.policyNumber || null,
    planName: planName || null,
    coverageLimit,
    validityFrom,
    validityTo,
  };

  // Check policyNumber uniqueness
  if (updates.policyNumber) {
    const existing = await User.findOne({ policyNumber: updates.policyNumber });
    if (existing && existing._id.toString() !== userId.toString()) {
      const err = new Error('Policy number already exists');
      err.code = 11000;
      throw err;
    }
  }

  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).lean();
  return user;
};

const findUserByEmail = async (email, includePassword = false) => {
  const query = User.findOne({ email });
  if (includePassword) {
    query.select("+password");
  }
  return query;
};

const findUserByPolicyNumber = async (policyNumber, includePassword = false) => {
  if (!policyNumber) {
    return null;
  }
  const query = User.findOne({ policyNumber: policyNumber.toUpperCase().trim() });
  if (includePassword) query.select('+password');
  return query;
};

const findUserByIdentifier = async (identifier, includePassword = false) => {
  if (!identifier) {
    return null;
  }
  const normalized = identifier.toLowerCase().trim();
  const query = User.findOne({
    $or: [{ email: normalized }, { mobileNumber: identifier.trim() }],
  });
  if (includePassword) {
    query.select("+password");
  }
  return query;
};

const ensureTestUser = async () => {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const email = "testuser@example.com";
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return existingUser;
  }

  // Use createUser to ensure policyNumber and transactionId are generated and validations pass
  const user = await createUser({
    fullName: "Test User",
    email,
    password: "Test@123",
    role: "user",
    mobileNumber: "+911234567890",
    planName: "Neev",
  });

  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByIdentifier,
  findUserByPolicyNumber,
  ensureTestUser,
};
