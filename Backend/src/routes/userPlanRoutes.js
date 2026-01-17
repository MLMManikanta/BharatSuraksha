const express = require("express");
const userPlanController = require("../controllers/userPlanController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, userPlanController.saveUserPlan);
router.get("/", authenticate, userPlanController.fetchUserPlans);

module.exports = router;
