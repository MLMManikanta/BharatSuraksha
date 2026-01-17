const express = require("express");
const claimController = require("../controllers/claimController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, claimController.createClaim);
router.get("/", authenticate, claimController.getUserClaims);

module.exports = router;
