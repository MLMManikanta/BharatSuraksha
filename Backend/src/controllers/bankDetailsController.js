const bankDetailsService = require("../services/bankDetailsService");

/**
 * Submit Bank Details
 * POST /api/bank
 */
const submitBankDetails = async (req, res) => {
  try {
    // userId is optional - new users won't have one yet
    const userId = req.user?.id || req.user?.userId || req.body.userId || null;

    const {
      kycId,
      medicalInfoId,
      paymentFrequency,
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      accountType,
      termsAccepted,
      planData,
    } = req.body;

    // Validate required fields
    if (!paymentFrequency) {
      return res.status(400).json({
        success: false,
        message: "Payment frequency is required",
      });
    }

    const validFrequencies = ["monthly", "quarterly", "halfyearly", "yearly"];
    if (!validFrequencies.includes(paymentFrequency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment frequency. Must be monthly, quarterly, halfyearly, or yearly",
      });
    }

    if (!accountHolderName || !accountHolderName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Account holder name is required",
      });
    }

    if (!accountNumber || !accountNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: "Account number is required",
      });
    }

    if (!/^\d{9,18}$/.test(accountNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account number. Must be 9-18 digits",
      });
    }

    if (!ifscCode || !ifscCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "IFSC code is required",
      });
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid IFSC code format",
      });
    }

    if (!bankName || !bankName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Bank name is required",
      });
    }

    if (!termsAccepted) {
      return res.status(400).json({
        success: false,
        message: "You must accept the terms and conditions to proceed",
      });
    }

    // Create Bank Details record
    const bankData = {
      paymentFrequency,
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.toUpperCase().trim(),
      bankName: bankName.trim(),
      accountType: accountType || "Savings",
      termsAccepted,
      planData: planData || {},
      status: "pending",
      submittedAt: new Date(),
    };

    // Only add userId if provided
    if (userId) {
      bankData.userId = userId;
    }

    // Only add kycId if provided
    if (kycId) {
      bankData.kycId = kycId;
    }

    // Only add medicalInfoId if provided
    if (medicalInfoId) {
      bankData.medicalInfoId = medicalInfoId;
    }

    const bankDetails = await bankDetailsService.createBankDetails(bankData);

    return res.status(201).json({
      success: true,
      message: "Bank details submitted successfully",
      data: {
        bankDetailsId: bankDetails._id,
        status: bankDetails.status,
        submittedAt: bankDetails.submittedAt,
      },
    });
  } catch (error) {
    console.error("Bank Details Submission Error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Get Bank Details for the logged-in user
 * GET /api/bank
 */
const getBankDetails = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const bankDetails = await bankDetailsService.findBankDetailsByUserId(userId);

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: bankDetails,
    });
  } catch (error) {
    console.error("Get Bank Details Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Get Bank Details by ID
 * GET /api/bank/:id
 */
const getBankDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    const bankDetails = await bankDetailsService.findBankDetailsById(id);

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: bankDetails,
    });
  } catch (error) {
    console.error("Get Bank Details by ID Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Get Bank Details by KYC ID
 * GET /api/bank/kyc/:kycId
 */
const getBankDetailsByKycId = async (req, res) => {
  try {
    const { kycId } = req.params;

    const bankDetails = await bankDetailsService.findBankDetailsByKycId(kycId);

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found for this KYC",
      });
    }

    return res.status(200).json({
      success: true,
      data: bankDetails,
    });
  } catch (error) {
    console.error("Get Bank Details by KYC ID Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Update Bank Details
 * PUT /api/bank/:id
 */
const updateBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.kycId;
    delete updateData.medicalInfoId;
    delete updateData.status;
    delete updateData.verifiedAt;
    delete updateData.verifiedBy;

    // Validate IFSC if being updated
    if (updateData.ifscCode) {
      updateData.ifscCode = updateData.ifscCode.toUpperCase().trim();
    }

    const bankDetails = await bankDetailsService.updateBankDetails(id, updateData);

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: bankDetails,
    });
  } catch (error) {
    console.error("Update Bank Details Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Get all Bank Details for admin
 * GET /api/bank/admin/all
 */
const getAllBankDetails = async (req, res) => {
  try {
    const { status } = req.query;

    let bankRecords;
    if (status) {
      bankRecords = await bankDetailsService.findBankDetailsByStatus(status);
    } else {
      bankRecords = await bankDetailsService.findBankDetailsByStatus("pending");
    }

    return res.status(200).json({
      success: true,
      count: bankRecords.length,
      data: bankRecords,
    });
  } catch (error) {
    console.error("Get All Bank Details Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Verify Bank Details
 * PATCH /api/bank/:id/verify
 */
const verifyBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const verifiedBy = req.user?.id || req.user?.userId;

    const bankDetails = await bankDetailsService.verifyBankDetails(id, verifiedBy);

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bank details verified successfully",
      data: bankDetails,
    });
  } catch (error) {
    console.error("Verify Bank Details Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Reject Bank Details
 * PATCH /api/bank/:id/reject
 */
const rejectBankDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const verifiedBy = req.user?.id || req.user?.userId;

    const bankDetails = await bankDetailsService.rejectBankDetails(id, verifiedBy);

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bank details rejected",
      data: bankDetails,
    });
  } catch (error) {
    console.error("Reject Bank Details Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = {
  submitBankDetails,
  getBankDetails,
  getBankDetailsById,
  getBankDetailsByKycId,
  updateBankDetails,
  getAllBankDetails,
  verifyBankDetails,
  rejectBankDetails,
};
