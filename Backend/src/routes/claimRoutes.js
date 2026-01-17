const express = require("express");
const claimController = require("../controllers/claimController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, claimController.createClaim);
router.get("/", authenticate, claimController.getUserClaims);
router.get("/:id", authenticate, claimController.getClaimById);
router.patch("/:id", authenticate, claimController.updateClaim);
router.patch("/:id/cancel", authenticate, claimController.cancelClaim);

module.exports = router;
