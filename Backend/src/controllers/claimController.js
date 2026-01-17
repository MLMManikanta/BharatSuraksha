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
    const claims = await Claim.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(claims);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createClaim,
  getUserClaims,
};
