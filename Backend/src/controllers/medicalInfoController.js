const medicalInfoService = require("../services/medicalInfoService");

/**
 * Submit Medical Information
 * POST /api/medical
 */
const submitMedicalInfo = async (req, res) => {
  try {
    // userId is optional - new users won't have one yet
    const userId = req.user?.id || req.user?.userId || req.body.userId || null;

    const {
      kycId,
      heightWeightMembers,
      illnessMembers,
      conditionsMembers,
      lifestyleMembers,
      acceptDeclaration,
      correctnessDeclaration,
      planData,
    } = req.body;

    // Validate required fields
    if (!heightWeightMembers || !Array.isArray(heightWeightMembers) || heightWeightMembers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Height and weight information for at least one member is required",
      });
    }

    // Validate height/weight data for each member
    for (const member of heightWeightMembers) {
      if (!member.memberId || !member.heightFeet || !member.heightInches || !member.weight) {
        return res.status(400).json({
          success: false,
          message: "Incomplete height/weight data for member",
        });
      }
    }

    // Validate illness members have descriptions
    if (illnessMembers && illnessMembers.length > 0) {
      for (const member of illnessMembers) {
        if (!member.description || !member.description.trim()) {
          return res.status(400).json({
            success: false,
            message: "Description required for all illness entries",
          });
        }
      }
    }

    // Validate conditions members have descriptions
    if (conditionsMembers && conditionsMembers.length > 0) {
      for (const member of conditionsMembers) {
        if (!member.description || !member.description.trim()) {
          return res.status(400).json({
            success: false,
            message: "Description required for all pre-existing condition entries",
          });
        }
      }
    }

    // Validate lifestyle members have descriptions
    if (lifestyleMembers && lifestyleMembers.length > 0) {
      for (const member of lifestyleMembers) {
        if (!member.description || !member.description.trim()) {
          return res.status(400).json({
            success: false,
            message: "Description required for all lifestyle entries",
          });
        }
      }
    }

    // Validate declarations
    if (!acceptDeclaration) {
      return res.status(400).json({
        success: false,
        message: "You must accept the declaration to proceed",
      });
    }

    if (!correctnessDeclaration) {
      return res.status(400).json({
        success: false,
        message: "You must confirm the correctness declaration to proceed",
      });
    }

    // Create Medical Info record
    const medicalData = {
      heightWeightMembers,
      illnessMembers: illnessMembers || [],
      conditionsMembers: conditionsMembers || [],
      lifestyleMembers: lifestyleMembers || [],
      acceptDeclaration,
      correctnessDeclaration,
      planData: planData || {},
      status: "pending",
      submittedAt: new Date(),
    };

    // Only add userId if provided
    if (userId) {
      medicalData.userId = userId;
    }

    // Only add kycId if provided
    if (kycId) {
      medicalData.kycId = kycId;
    }

    const medicalInfo = await medicalInfoService.createMedicalInfo(medicalData);

    return res.status(201).json({
      success: true,
      message: "Medical information submitted successfully",
      data: {
        medicalInfoId: medicalInfo._id,
        status: medicalInfo.status,
        submittedAt: medicalInfo.submittedAt,
      },
    });
  } catch (error) {
    console.error("Medical Info Submission Error:", error);

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
 * Get Medical Info for the logged-in user
 * GET /api/medical
 */
const getMedicalInfo = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const medicalInfo = await medicalInfoService.findMedicalInfoByUserId(userId);

    if (!medicalInfo) {
      return res.status(404).json({
        success: false,
        message: "Medical information not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: medicalInfo,
    });
  } catch (error) {
    console.error("Get Medical Info Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Get Medical Info by ID
 * GET /api/medical/:id
 */
const getMedicalInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const medicalInfo = await medicalInfoService.findMedicalInfoById(id);

    if (!medicalInfo) {
      return res.status(404).json({
        success: false,
        message: "Medical information not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: medicalInfo,
    });
  } catch (error) {
    console.error("Get Medical Info by ID Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Get Medical Info by KYC ID
 * GET /api/medical/kyc/:kycId
 */
const getMedicalInfoByKycId = async (req, res) => {
  try {
    const { kycId } = req.params;

    const medicalInfo = await medicalInfoService.findMedicalInfoByKycId(kycId);

    if (!medicalInfo) {
      return res.status(404).json({
        success: false,
        message: "Medical information not found for this KYC",
      });
    }

    return res.status(200).json({
      success: true,
      data: medicalInfo,
    });
  } catch (error) {
    console.error("Get Medical Info by KYC ID Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Update Medical Info
 * PUT /api/medical/:id
 */
const updateMedicalInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.kycId;
    delete updateData.status;
    delete updateData.reviewedAt;
    delete updateData.reviewedBy;

    const medicalInfo = await medicalInfoService.updateMedicalInfo(id, updateData);

    if (!medicalInfo) {
      return res.status(404).json({
        success: false,
        message: "Medical information not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical information updated successfully",
      data: medicalInfo,
    });
  } catch (error) {
    console.error("Update Medical Info Error:", error);

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
 * Get all Medical Info records for admin
 * GET /api/medical/admin/all
 */
const getAllMedicalInfo = async (req, res) => {
  try {
    const { status } = req.query;

    let medicalRecords;
    if (status) {
      medicalRecords = await medicalInfoService.findMedicalInfoByStatus(status);
    } else {
      medicalRecords = await medicalInfoService.findMedicalInfoByStatus("pending");
    }

    return res.status(200).json({
      success: true,
      count: medicalRecords.length,
      data: medicalRecords,
    });
  } catch (error) {
    console.error("Get All Medical Info Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Approve Medical Info
 * PATCH /api/medical/:id/approve
 */
const approveMedicalInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewedBy = req.user?.id || req.user?.userId;
    const { reviewNotes } = req.body;

    const medicalInfo = await medicalInfoService.approveMedicalInfo(id, reviewedBy, reviewNotes);

    if (!medicalInfo) {
      return res.status(404).json({
        success: false,
        message: "Medical information not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical information approved successfully",
      data: medicalInfo,
    });
  } catch (error) {
    console.error("Approve Medical Info Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Reject Medical Info
 * PATCH /api/medical/:id/reject
 */
const rejectMedicalInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewedBy = req.user?.id || req.user?.userId;
    const { reviewNotes } = req.body;

    const medicalInfo = await medicalInfoService.rejectMedicalInfo(id, reviewedBy, reviewNotes);

    if (!medicalInfo) {
      return res.status(404).json({
        success: false,
        message: "Medical information not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medical information rejected",
      data: medicalInfo,
    });
  } catch (error) {
    console.error("Reject Medical Info Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

/**
 * Request additional info
 * PATCH /api/medical/:id/request-info
 */
const requestAdditionalInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewedBy = req.user?.id || req.user?.userId;
    const { reviewNotes } = req.body;

    if (!reviewNotes) {
      return res.status(400).json({
        success: false,
        message: "Review notes specifying required information is mandatory",
      });
    }

    const medicalInfo = await medicalInfoService.requestAdditionalInfo(id, reviewedBy, reviewNotes);

    if (!medicalInfo) {
      return res.status(404).json({
        success: false,
        message: "Medical information not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Additional information requested",
      data: medicalInfo,
    });
  } catch (error) {
    console.error("Request Additional Info Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

module.exports = {
  submitMedicalInfo,
  getMedicalInfo,
  getMedicalInfoById,
  getMedicalInfoByKycId,
  updateMedicalInfo,
  getAllMedicalInfo,
  approveMedicalInfo,
  rejectMedicalInfo,
  requestAdditionalInfo,
};
