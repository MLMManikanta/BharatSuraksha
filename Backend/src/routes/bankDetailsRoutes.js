const express = require("express");
const bankDetailsController = require("../controllers/bankDetailsController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

// Submit Bank Details (no authentication required for new users)
router.post("/", bankDetailsController.submitBankDetails);

// Get Bank Details for logged-in user
router.get("/", authenticate, bankDetailsController.getBankDetails);

// Get Bank Details by ID
router.get("/:id", bankDetailsController.getBankDetailsById);

// Get Bank Details by KYC ID
router.get("/kyc/:kycId", bankDetailsController.getBankDetailsByKycId);

// Update Bank Details
router.put("/:id", authenticate, bankDetailsController.updateBankDetails);

// Admin routes
router.get("/admin/all", authenticate, bankDetailsController.getAllBankDetails);
router.patch("/:id/verify", authenticate, bankDetailsController.verifyBankDetails);
router.patch("/:id/reject", authenticate, bankDetailsController.rejectBankDetails);

module.exports = router;
