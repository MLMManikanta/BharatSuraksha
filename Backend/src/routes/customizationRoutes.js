const express = require("express");
const customizationController = require("../controllers/customizationController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, customizationController.customizePlan);

module.exports = router;
