const kycService = require("../services/kycService");

/**
 * Submit KYC details
 * POST /api/kyc
 */
const submitKYC = async (req, res) => {
  try {
    // userId is optional - new users won't have one yet
    const userId = req.user?.id || req.user?.userId || req.body.userId || null;

    const { proposer, members, address, contact, ageValidation, planData } = req.body;

    // Validate required fields
    if (!proposer || !members || !address || !contact) {
      return res.status(400).json({
        success: false,
        message: "Missing required KYC information",
      });
    }

    // Validate proposer details
    if (!proposer.fullName || !proposer.dateOfBirth || !proposer.gender || 
        !proposer.maritalStatus || !proposer.occupation) {
      return res.status(400).json({
        success: false,
        message: "Incomplete proposer details",
      });
    }

    // Validate PAN or noPAN declaration
    if (!proposer.noPAN && !proposer.panCard) {
      return res.status(400).json({
        success: false,
        message: "PAN card number or declaration is required",
      });
    }

    // Validate members
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one member is required",
      });
    }

    for (const member of members) {
      if (!member.name || !member.dateOfBirth || !member.relationship) {
        return res.status(400).json({
          success: false,
          message: "Incomplete member details",
        });
      }
    }

    // Validate address
    if (!address.house || !address.street || !address.city || 
        !address.state || !address.pincode) {
      return res.status(400).json({
        success: false,
        message: "Incomplete address details",
      });
    }

    // Validate contact
    if (!contact.email || !contact.mobileNumber || !contact.emergencyContact) {
      return res.status(400).json({
        success: false,
        message: "Incomplete contact details",
      });
    }

    // Create KYC record
    const kycData = {
      proposer,
      members,
      address,
      contact,
      ageValidation: ageValidation || { hasMismatch: false, messages: [] },
      planData: planData || {},
      status: "pending",
    };

    // Only add userId if provided
    if (userId) {
      kycData.userId = userId;
    }

    const kyc = await kycService.createKYC(kycData);

    return res.status(201).json({
      success: true,
      message: "KYC details submitted successfully",
      data: {
        kycId: kyc._id,
        status: kyc.status,
        createdAt: kyc.createdAt,
      },
    });
  } catch (error) {
    console.error("KYC Submission Error:", error);
    
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
 * Get KYC details for the logged-in user
 * GET /api/kyc
 */
const getKYC = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const kyc = await kycService.findKYCByUserId(userId);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: kyc,
    });
  } catch (error) {
    console.error("Get KYC Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Get KYC by ID
 * GET /api/kyc/:id
 */
const getKYCById = async (req, res) => {
  try {
    const { id } = req.params;

    const kyc = await kycService.findKYCById(id);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: kyc,
    });
  } catch (error) {
    console.error("Get KYC by ID Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Update KYC details
 * PUT /api/kyc/:id
 */
const updateKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.status;
    delete updateData.verifiedAt;
    delete updateData.verifiedBy;

    const kyc = await kycService.updateKYC(id, updateData);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "KYC details updated successfully",
      data: kyc,
    });
  } catch (error) {
    console.error("Update KYC Error:", error);
    
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
 * Get all KYC records for admin
 * GET /api/kyc/admin/all
 */
const getAllKYC = async (req, res) => {
  try {
    const { status } = req.query;

    let kycRecords;
    if (status) {
      kycRecords = await kycService.findKYCByStatus(status);
    } else {
      kycRecords = await kycService.findKYCByStatus("pending");
    }

    return res.status(200).json({
      success: true,
      count: kycRecords.length,
      data: kycRecords,
    });
  } catch (error) {
    console.error("Get All KYC Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Verify KYC
 * PATCH /api/kyc/:id/verify
 */
const verifyKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const verifiedBy = req.user?.id || req.user?.userId;

    const kyc = await kycService.verifyKYC(id, verifiedBy);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "KYC verified successfully",
      data: kyc,
    });
  } catch (error) {
    console.error("Verify KYC Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Reject KYC
 * PATCH /api/kyc/:id/reject
 */
const rejectKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const verifiedBy = req.user?.id || req.user?.userId;

    const kyc = await kycService.rejectKYC(id, verifiedBy);

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "KYC details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "KYC rejected",
      data: kyc,
    });
  } catch (error) {
    console.error("Reject KYC Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = {
  submitKYC,
  getKYC,
  getKYCById,
  updateKYC,
  getAllKYC,
  verifyKYC,
  rejectKYC,
};
