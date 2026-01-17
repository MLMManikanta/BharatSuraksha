const UserPlan = require("../models/UserPlan");

const createUserPlan = async (payload) => {
  return UserPlan.create(payload);
};

const getUserPlans = async (userId) => {
  return UserPlan.find({ userId })
    .populate("planId")
    .populate("selectedAddOns.addOn")
    .sort({ createdAt: -1 });
};

module.exports = {
  createUserPlan,
  getUserPlans,
};
