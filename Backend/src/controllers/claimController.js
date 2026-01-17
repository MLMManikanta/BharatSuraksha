const Claim = require("../models/Claim");

const createClaim = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      userId: req.user.id,
    };

    const claim = await Claim.create(payload);
    return res.status(201).json(claim);
  } catch (error) {
    return next(error);
  }
};

const getUserClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ userId: req.user.id })
      .populate("userId", "fullName")
      .sort({ createdAt: -1 });
    return res.json(claims);
  } catch (error) {
    return next(error);
  }
};

const getClaimById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findOne({ _id: id, userId: req.user.id }).populate(
      "userId",
      "fullName"
    );
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }
    return res.json(claim);
  } catch (error) {
    return next(error);
  }
};

const updateClaim = async (req, res, next) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findOne({ _id: id, userId: req.user.id });
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status === "Cancelled" || claim.status === "Completed") {
      return res.status(400).json({ message: "Claim cannot be edited" });
    }

    const allowedFields = [
      "claimType",
      "claimCycle",
      "dependentId",
      "dependentName",
      "dayCare",
      "admissionDate",
      "dischargeDate",
      "mobile",
      "hospitalAddress",
      "diagnosis",
      "dropboxLocation",
      "claimedAmount",
      "remarks",
      "consentSummary",
      "consentTerms",
      "hospitalizationType",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        claim[field] = req.body[field];
      }
    });

    const updated = await claim.save();
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const cancelClaim = async (req, res, next) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findOne({ _id: id, userId: req.user.id });
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status === "Cancelled" || claim.status === "Completed") {
      return res.status(400).json({ message: "Claim cannot be cancelled" });
    }

    claim.status = "Cancelled";
    const updated = await claim.save();
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createClaim,
  getUserClaims,
  getClaimById,
  updateClaim,
  cancelClaim,
};
