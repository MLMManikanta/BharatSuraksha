const InsurancePlan = require("../models/InsurancePlan");

const listPlans = async (filter = {}) => {
  return InsurancePlan.find(filter).sort({ createdAt: -1 });
};

const getPlanById = async (id) => {
  return InsurancePlan.findById(id);
};

const createPlan = async (payload) => {
  return InsurancePlan.create(payload);
};

const updatePlan = async (id, payload) => {
  return InsurancePlan.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const disablePlan = async (id) => {
  return InsurancePlan.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};

module.exports = {
  listPlans,
  getPlanById,
  createPlan,
  updatePlan,
  disablePlan,
};
