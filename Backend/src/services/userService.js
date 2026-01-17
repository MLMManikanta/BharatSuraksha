const User = require("../models/User");

const createUser = async ({
  fullName,
  email,
  mobileNumber,
  password,
  role,
  policyNumber,
}) => {
  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    role,
    policyNumber,
  });
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

  const user = await User.create({
    fullName: "Test User",
    email,
    password: "Test@123",
    role: "user",
    mobileNumber: "+911234567890",
    policyNumber: "BS-TEST-2026-0001",
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
