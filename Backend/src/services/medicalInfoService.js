const MedicalInfo = require("../models/MedicalInfo");

/**
 * Create a new Medical Info record
 * @param {Object} medicalData - Medical information data object
 * @returns {Promise<Object>} Created MedicalInfo document
 */
const createMedicalInfo = async (medicalData) => {
  const medicalInfo = await MedicalInfo.create(medicalData);
  return medicalInfo;
};

/**
 * Find Medical Info by user ID
 * @param {String} userId - User ID
 * @returns {Promise<Object|null>} MedicalInfo document or null
 */
const findMedicalInfoByUserId = async (userId) => {
  return MedicalInfo.findOne({ userId }).sort({ createdAt: -1 });
};

/**
 * Find Medical Info by KYC ID
 * @param {String} kycId - KYC document ID
 * @returns {Promise<Object|null>} MedicalInfo document or null
 */
const findMedicalInfoByKycId = async (kycId) => {
  return MedicalInfo.findOne({ kycId }).sort({ createdAt: -1 });
};

/**
 * Find all Medical Info records for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} Array of MedicalInfo documents
 */
const findAllMedicalInfoByUserId = async (userId) => {
  return MedicalInfo.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Find Medical Info by ID
 * @param {String} medicalInfoId - MedicalInfo document ID
 * @returns {Promise<Object|null>} MedicalInfo document or null
 */
const findMedicalInfoById = async (medicalInfoId) => {
  return MedicalInfo.findById(medicalInfoId);
};

/**
 * Update Medical Info record
 * @param {String} medicalInfoId - MedicalInfo document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated MedicalInfo document
 */
const updateMedicalInfo = async (medicalInfoId, updateData) => {
  return MedicalInfo.findByIdAndUpdate(medicalInfoId, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Update Medical Info by KYC ID
 * @param {String} kycId - KYC document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated MedicalInfo document
 */
const updateMedicalInfoByKycId = async (kycId, updateData) => {
  return MedicalInfo.findOneAndUpdate(
    { kycId },
    updateData,
    { new: true, runValidators: true, sort: { createdAt: -1 } }
  );
};

/**
 * Delete Medical Info record
 * @param {String} medicalInfoId - MedicalInfo document ID
 * @returns {Promise<Object|null>} Deleted MedicalInfo document
 */
const deleteMedicalInfo = async (medicalInfoId) => {
  return MedicalInfo.findByIdAndDelete(medicalInfoId);
};

/**
 * Approve Medical Info record
 * @param {String} medicalInfoId - MedicalInfo document ID
 * @param {String} reviewedBy - User ID of the reviewer
 * @param {String} reviewNotes - Optional review notes
 * @returns {Promise<Object|null>} Updated MedicalInfo document
 */
const approveMedicalInfo = async (medicalInfoId, reviewedBy, reviewNotes = "") => {
  return MedicalInfo.findByIdAndUpdate(
    medicalInfoId,
    {
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy,
      reviewNotes,
    },
    { new: true }
  );
};

/**
 * Reject Medical Info record
 * @param {String} medicalInfoId - MedicalInfo document ID
 * @param {String} reviewedBy - User ID of the reviewer
 * @param {String} reviewNotes - Rejection reason
 * @returns {Promise<Object|null>} Updated MedicalInfo document
 */
const rejectMedicalInfo = async (medicalInfoId, reviewedBy, reviewNotes = "") => {
  return MedicalInfo.findByIdAndUpdate(
    medicalInfoId,
    {
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy,
      reviewNotes,
    },
    { new: true }
  );
};

/**
 * Request additional info for Medical Info record
 * @param {String} medicalInfoId - MedicalInfo document ID
 * @param {String} reviewedBy - User ID of the reviewer
 * @param {String} reviewNotes - Notes specifying what additional info is needed
 * @returns {Promise<Object|null>} Updated MedicalInfo document
 */
const requestAdditionalInfo = async (medicalInfoId, reviewedBy, reviewNotes) => {
  return MedicalInfo.findByIdAndUpdate(
    medicalInfoId,
    {
      status: "additional-info-required",
      reviewedAt: new Date(),
      reviewedBy,
      reviewNotes,
    },
    { new: true }
  );
};

/**
 * Get Medical Info records by status
 * @param {String} status - Medical info status
 * @returns {Promise<Array>} Array of MedicalInfo documents
 */
const findMedicalInfoByStatus = async (status) => {
  return MedicalInfo.find({ status })
    .sort({ createdAt: -1 })
    .populate("userId", "email fullName")
    .populate("kycId");
};

module.exports = {
  createMedicalInfo,
  findMedicalInfoByUserId,
  findMedicalInfoByKycId,
  findAllMedicalInfoByUserId,
  findMedicalInfoById,
  updateMedicalInfo,
  updateMedicalInfoByKycId,
  deleteMedicalInfo,
  approveMedicalInfo,
  rejectMedicalInfo,
  requestAdditionalInfo,
  findMedicalInfoByStatus,
};
