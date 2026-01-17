const mongoose = require("mongoose");
const userPlanService = require("../services/userPlanService");
const customizationService = require("../services/customizationService");

const saveUserPlan = async (req, res, next) => {
  try {
    const {
      planId,
      addOnIds = [],
      customizationSummary,
      roomRentSelection,
      coPayment,
      waitingPeriodReductionDays,
    } = req.body;

    if (!planId) {
      return res.status(400).json({ message: "planId is required" });
    }

    const calc = await customizationService.calculatePremium({
      planId,
      addOnIds,
      roomRentSelection,
      coPayment,
      waitingPeriodReductionDays,
    });

    if (calc.error) {
      return res.status(400).json({ message: calc.error });
    }

    const selectedAddOns = calc.addOns.map((addOn) => ({
      addOn: addOn._id,
      priceImpact: addOn.priceImpact || 0,
    }));

    const userPlan = await userPlanService.createUserPlan({
      userId: req.user.id,
      planId: calc.plan._id,
      selectedAddOns,
      finalPremium: calc.finalPremium,
      customizationSummary: customizationSummary || {
        basePremium: calc.basePremium,
        addOnTotal: calc.addOnTotal,
        roomRentAdjustment: calc.roomRentAdjustment,
        coPaymentAdjustment: calc.coPaymentAdjustment,
        waitingPeriodAdjustment: calc.waitingPeriodAdjustment,
        finalPremium: calc.finalPremium,
      },
      planStatus: "draft",
    });

    return res.status(201).json(userPlan);
  } catch (error) {
    return next(error);
  }
};

const fetchUserPlans = async (req, res, next) => {
  try {
    const plans = await userPlanService.getUserPlans(req.user.id);
    return res.json(plans);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  saveUserPlan,
  fetchUserPlans,
};
