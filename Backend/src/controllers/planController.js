const mongoose = require("mongoose");
const planService = require("../services/planService");

const getAllPlans = async (req, res, next) => {
  try {
    const filter = { isActive: true };
    const plans = await planService.listPlans(filter);
    return res.json(plans);
  } catch (error) {
    return next(error);
  }
};

const getPlanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan id" });
    }

    const plan = await planService.getPlanById(id);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return res.json(plan);
  } catch (error) {
    return next(error);
  }
};

const createPlan = async (req, res, next) => {
  try {
    const plan = await planService.createPlan(req.body);
    return res.status(201).json(plan);
  } catch (error) {
    return next(error);
  }
};

const updatePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan id" });
    }

    const plan = await planService.updatePlan(id, req.body);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return res.json(plan);
  } catch (error) {
    return next(error);
  }
};

const disablePlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan id" });
    }

    const plan = await planService.disablePlan(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return res.json(plan);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  disablePlan,
};
