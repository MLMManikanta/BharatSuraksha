const express = require("express");
const medicalInfoController = require("../controllers/medicalInfoController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

// Submit Medical Info (no authentication required for new users)
router.post("/", medicalInfoController.submitMedicalInfo);

// Get Medical Info for logged-in user
router.get("/", authenticate, medicalInfoController.getMedicalInfo);

// Get Medical Info by ID
router.get("/:id", medicalInfoController.getMedicalInfoById);

// Get Medical Info by KYC ID
router.get("/kyc/:kycId", medicalInfoController.getMedicalInfoByKycId);

// Update Medical Info
router.put("/:id", authenticate, medicalInfoController.updateMedicalInfo);

// Admin routes
router.get("/admin/all", authenticate, medicalInfoController.getAllMedicalInfo);
router.patch("/:id/approve", authenticate, medicalInfoController.approveMedicalInfo);
router.patch("/:id/reject", authenticate, medicalInfoController.rejectMedicalInfo);
router.patch("/:id/request-info", authenticate, medicalInfoController.requestAdditionalInfo);

module.exports = router;
