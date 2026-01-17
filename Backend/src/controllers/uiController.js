const mongoose = require("mongoose");
const InsurancePlan = require("../models/InsurancePlan");
const PlanCustomizationOption = require("../models/PlanCustomizationOption");
const PlanCustomization = require("../models/PlanCustomization");

const PLAN_FIELD_LABELS = {
  planName: "Plan Name",
  sumInsured: "Sum Insured",
  basePremium: "Base Premium",
  roomRentLimit: "Room Rent Limit",
  coPayment: "Co-payment",
  waitingPeriods: "Waiting Periods",
  preHospitalizationDays: "Pre-Hospitalization Days",
  postHospitalizationDays: "Post-Hospitalization Days",
  restorationBenefit: "Restoration Benefit",
  dayCareCoverage: "Day Care Coverage",
};

const PLAN_FIELD_TOOLTIPS = {
  sumInsured: "Maximum coverage amount for the policy term.",
  basePremium: "Starting premium before add-ons and adjustments.",
  roomRentLimit: "Room category or daily room rent limit covered.",
  coPayment: "Percentage or fixed amount paid by the policyholder.",
  waitingPeriods: "Initial and condition-specific waiting periods.",
  preHospitalizationDays: "Days covered before hospitalization.",
  postHospitalizationDays: "Days covered after hospitalization.",
  restorationBenefit: "Rules for reinstating sum insured during the policy.",
  dayCareCoverage: "Coverage for day-care procedures.",
};

const formatPlanUi = (plan) => {
  const fields = [
    {
      key: "sumInsured",
      label: PLAN_FIELD_LABELS.sumInsured,
      tooltip: PLAN_FIELD_TOOLTIPS.sumInsured,
      value: plan.sumInsured,
    },
    {
      key: "basePremium",
      label: PLAN_FIELD_LABELS.basePremium,
      tooltip: PLAN_FIELD_TOOLTIPS.basePremium,
      value: plan.basePremium,
    },
    {
      key: "roomRentLimit",
      label: PLAN_FIELD_LABELS.roomRentLimit,
      tooltip: PLAN_FIELD_TOOLTIPS.roomRentLimit,
      value: plan.roomRentLimit,
    },
    {
      key: "coPayment",
      label: PLAN_FIELD_LABELS.coPayment,
      tooltip: PLAN_FIELD_TOOLTIPS.coPayment,
      value: plan.coPayment,
    },
    {
      key: "waitingPeriods",
      label: PLAN_FIELD_LABELS.waitingPeriods,
      tooltip: PLAN_FIELD_TOOLTIPS.waitingPeriods,
      value: plan.waitingPeriods,
    },
    {
      key: "preHospitalizationDays",
      label: PLAN_FIELD_LABELS.preHospitalizationDays,
      tooltip: PLAN_FIELD_TOOLTIPS.preHospitalizationDays,
      value: plan.preHospitalizationDays,
    },
    {
      key: "postHospitalizationDays",
      label: PLAN_FIELD_LABELS.postHospitalizationDays,
      tooltip: PLAN_FIELD_TOOLTIPS.postHospitalizationDays,
      value: plan.postHospitalizationDays,
    },
    {
      key: "restorationBenefit",
      label: PLAN_FIELD_LABELS.restorationBenefit,
      tooltip: PLAN_FIELD_TOOLTIPS.restorationBenefit,
      value: plan.restorationBenefit,
    },
    {
      key: "dayCareCoverage",
      label: PLAN_FIELD_LABELS.dayCareCoverage,
      tooltip: PLAN_FIELD_TOOLTIPS.dayCareCoverage,
      value: plan.dayCareCoverage,
    },
  ];

  return {
    id: plan._id,
    planName: plan.planName,
    code: plan.code,
    description: plan.description,
    currency: plan.currency,
    isActive: plan.isActive,
    labels: PLAN_FIELD_LABELS,
    tooltips: PLAN_FIELD_TOOLTIPS,
    fields,
  };
};

const mapOptionToUi = (option) => {
  let uiType = "dropdown";
  if (option.type === "boolean") uiType = "toggle";
  if (option.type === "number" && option.options?.length) uiType = "radio";

  return {
    id: option._id,
    key: option.key,
    label: option.label,
    tooltip: option.description,
    uiType,
    required: option.required,
    defaultValue: option.defaultValue,
    min: option.min,
    max: option.max,
    step: option.step,
    choices: (option.options || []).map((opt) => ({
      label: opt.label,
      value: opt.value,
      priceDelta: opt.priceDelta,
    })),
  };
};

const mapAddOnToUi = (addOn) => ({
  id: addOn._id,
  addOnName: addOn.addOnName,
  description: addOn.description,
  priceImpact: addOn.priceImpact,
  impactType: addOn.impactType,
  uiType: "toggle",
});

const getPlansUi = async (req, res, next) => {
  try {
    const plans = await InsurancePlan.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({
      plans: plans.map(formatPlanUi),
    });
  } catch (error) {
    return next(error);
  }
};

const getPlanUiById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan id" });
    }

    const plan = await InsurancePlan.findById(id);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "Plan not found" });
    }

    return res.json({ plan: formatPlanUi(plan) });
  } catch (error) {
    return next(error);
  }
};

const getCustomizationOptionsUi = async (req, res, next) => {
  try {
    const { planId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ message: "Invalid plan id" });
    }

    const options = await PlanCustomizationOption.find({
      plan: planId,
      isActive: true,
    }).sort({ createdAt: 1 });

    const addOns = await PlanCustomization.find({
      applicablePlans: planId,
      isActive: true,
    }).sort({ createdAt: 1 });

    return res.json({
      planId,
      options: options.map(mapOptionToUi),
      addOns: addOns.map(mapAddOnToUi),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPlansUi,
  getPlanUiById,
  getCustomizationOptionsUi,
};
