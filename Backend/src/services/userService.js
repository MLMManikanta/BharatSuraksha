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

const findUserByEmail = async (email, includePassword = false) => {
  const query = User.findOne({ email });
  if (includePassword) {
    query.select("+password");
  }
  return query;
};

const findUserByPolicyNumber = async (policyNumber) => {
  if (!policyNumber) {
    return null;
  }
  return User.findOne({ policyNumber: policyNumber.toUpperCase().trim() });
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
