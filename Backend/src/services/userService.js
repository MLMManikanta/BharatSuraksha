const User = require("../models/User");

const createUser = async ({ fullName, email, mobileNumber, password, role }) => {
  const user = await User.create({
    fullName,
    email,
    mobileNumber,
    password,
    role,
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
  });

  return user;
};

module.exports = {
  createUser,
  findUserByEmail,
  ensureTestUser,
};
