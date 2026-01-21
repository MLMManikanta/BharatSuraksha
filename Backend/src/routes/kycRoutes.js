const express = require("express");
const kycController = require("../controllers/kycController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

// Submit KYC details (no authentication required for new users)
router.post("/", kycController.submitKYC);

// Get KYC details for logged-in user
router.get("/", authenticate, kycController.getKYC);

// Get KYC by ID
router.get("/:id", authenticate, kycController.getKYCById);

// Update KYC details
router.put("/:id", authenticate, kycController.updateKYC);

// Admin routes
router.get("/admin/all", authenticate, kycController.getAllKYC);
router.patch("/:id/verify", authenticate, kycController.verifyKYC);
router.patch("/:id/reject", authenticate, kycController.rejectKYC);

module.exports = router;
