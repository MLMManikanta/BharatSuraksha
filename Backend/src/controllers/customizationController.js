const customizationService = require("../services/customizationService");

const customizePlan = async (req, res, next) => {
  try {
    const { planId, addOnIds, roomRentSelection, coPayment, waitingPeriodReductionDays } = req.body;
    if (!planId) {
      return res.status(400).json({ message: "planId is required" });
    }

    const result = await customizationService.calculatePremium({
      planId,
      addOnIds,
      roomRentSelection,
      coPayment,
      waitingPeriodReductionDays,
    });

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.json({
      planId: result.plan._id,
      basePremium: result.basePremium,
      addOnTotal: result.addOnTotal,
      roomRentAdjustment: result.roomRentAdjustment,
      coPaymentAdjustment: result.coPaymentAdjustment,
      waitingPeriodAdjustment: result.waitingPeriodAdjustment,
      finalPremium: result.finalPremium,
      selectedAddOns: result.addOns.map((addOn) => ({
        id: addOn._id,
        addOnName: addOn.addOnName,
        priceImpact: addOn.priceImpact,
      })),
      breakdown: {
        basePremium: result.basePremium,
        addOnTotal: result.addOnTotal,
        roomRentAdjustment: result.roomRentAdjustment,
        coPaymentAdjustment: result.coPaymentAdjustment,
        waitingPeriodAdjustment: result.waitingPeriodAdjustment,
        finalPremium: result.finalPremium,
      },
      breakdownItems: [
        {
          key: "basePremium",
          label: "Base Premium",
          tooltip: "Starting premium before adjustments.",
          amount: result.basePremium,
        },
        {
          key: "addOnTotal",
          label: "Add-ons",
          tooltip: "Total cost of selected add-ons.",
          amount: result.addOnTotal,
        },
        {
          key: "roomRentAdjustment",
          label: "Room Rent Adjustment",
          tooltip: "Premium change based on room selection.",
          amount: result.roomRentAdjustment,
        },
        {
          key: "coPaymentAdjustment",
          label: "Co-payment Adjustment",
          tooltip: "Premium reduction based on co-payment selection.",
          amount: result.coPaymentAdjustment,
        },
        {
          key: "waitingPeriodAdjustment",
          label: "Waiting Period Adjustment",
          tooltip: "Premium increase for waiting period reduction.",
          amount: result.waitingPeriodAdjustment,
        },
        {
          key: "finalPremium",
          label: "Final Premium",
          tooltip: "Total premium after all adjustments.",
          amount: result.finalPremium,
        },
      ],
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { customizePlan };
