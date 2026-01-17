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

module.exports = {
  createUser,
  findUserByEmail,
};
