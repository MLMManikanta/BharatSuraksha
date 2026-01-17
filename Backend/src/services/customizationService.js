const mongoose = require("mongoose");
const InsurancePlan = require("../models/InsurancePlan");
const PlanCustomization = require("../models/PlanCustomization");

const ROOM_RENT_SURCHARGE_MAP = {
  fixed: 0,
  percent_sum_insured: 0.05,
  single_private_ac: 0.08,
  deluxe: 0.12,
  any_room: 0.15,
};

const calculatePremium = async ({
  planId,
  addOnIds = [],
  roomRentSelection,
  coPayment,
  waitingPeriodReductionDays = 0,
}) => {
  if (!mongoose.Types.ObjectId.isValid(planId)) {
    return { error: "Invalid planId" };
  }

  const plan = await InsurancePlan.findById(planId);
  if (!plan || !plan.isActive) {
    return { error: "Plan not found" };
  }

  const addOns = addOnIds.length
    ? await PlanCustomization.find({
        _id: { $in: addOnIds },
        isActive: true,
        applicablePlans: plan._id,
      })
    : [];

  const addOnTotal = addOns.reduce(
    (sum, item) => sum + (item.priceImpact || 0),
    0
  );

  const basePremium = plan.basePremium;

  let roomRentAdjustment = 0;
  if (roomRentSelection) {
    const selectionType =
      typeof roomRentSelection === "string"
        ? roomRentSelection
        : roomRentSelection.type;
    const selectionValue =
      typeof roomRentSelection === "object"
        ? roomRentSelection.value
        : undefined;

    if (selectionType === "fixed" && selectionValue !== undefined) {
      if (selectionValue > (plan.roomRentLimit?.value || 0)) {
        roomRentAdjustment = basePremium * 0.03;
      }
    } else if (selectionType && selectionType !== plan.roomRentLimit?.type) {
      roomRentAdjustment = basePremium * (ROOM_RENT_SURCHARGE_MAP[selectionType] || 0);
    }
  }

  let coPaymentAdjustment = 0;
  const effectiveCoPay = coPayment || plan.coPayment;
  if (effectiveCoPay?.type === "percent" && effectiveCoPay.value) {
    coPaymentAdjustment = -basePremium * (effectiveCoPay.value / 100);
  }
  if (effectiveCoPay?.type === "fixed" && effectiveCoPay.value) {
    coPaymentAdjustment = -effectiveCoPay.value;
  }

  const reductionDays = Math.max(0, Number(waitingPeriodReductionDays) || 0);
  const waitingPeriodAdjustment = reductionDays
    ? basePremium * (Math.min(reductionDays, 365) / 30) * 0.02
    : 0;

  const finalPremium =
    basePremium +
    addOnTotal +
    roomRentAdjustment +
    coPaymentAdjustment +
    waitingPeriodAdjustment;

  return {
    plan,
    addOns,
    basePremium,
    addOnTotal,
    roomRentAdjustment,
    coPaymentAdjustment,
    waitingPeriodAdjustment,
    finalPremium,
  };
};

module.exports = { calculatePremium };
