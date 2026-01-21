const KYC = require("../models/KYC");

/**
 * Create a new KYC record
 * @param {Object} kycData - KYC data object
 * @returns {Promise<Object>} Created KYC document
 */
const createKYC = async (kycData) => {
  const kyc = await KYC.create(kycData);
  return kyc;
};

/**
 * Find KYC by user ID
 * @param {String} userId - User ID
 * @returns {Promise<Object|null>} KYC document or null
 */
const findKYCByUserId = async (userId) => {
  return KYC.findOne({ userId }).sort({ createdAt: -1 });
};

/**
 * Find all KYC records for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} Array of KYC documents
 */
const findAllKYCByUserId = async (userId) => {
  return KYC.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Find KYC by ID
 * @param {String} kycId - KYC document ID
 * @returns {Promise<Object|null>} KYC document or null
 */
const findKYCById = async (kycId) => {
  return KYC.findById(kycId);
};

/**
 * Update KYC record
 * @param {String} kycId - KYC document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated KYC document
 */
const updateKYC = async (kycId, updateData) => {
  return KYC.findByIdAndUpdate(kycId, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Update KYC by user ID (updates the latest KYC record)
 * @param {String} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated KYC document
 */
const updateKYCByUserId = async (userId, updateData) => {
  return KYC.findOneAndUpdate(
    { userId },
    updateData,
    { new: true, runValidators: true, sort: { createdAt: -1 } }
  );
};

/**
 * Delete KYC record
 * @param {String} kycId - KYC document ID
 * @returns {Promise<Object|null>} Deleted KYC document
 */
const deleteKYC = async (kycId) => {
  return KYC.findByIdAndDelete(kycId);
};

/**
 * Verify KYC record
 * @param {String} kycId - KYC document ID
 * @param {String} verifiedBy - User ID of the verifier
 * @returns {Promise<Object|null>} Updated KYC document
 */
const verifyKYC = async (kycId, verifiedBy) => {
  return KYC.findByIdAndUpdate(
    kycId,
    {
      status: "verified",
      verifiedAt: new Date(),
      verifiedBy,
    },
    { new: true }
  );
};

/**
 * Reject KYC record
 * @param {String} kycId - KYC document ID
 * @param {String} verifiedBy - User ID of the verifier
 * @returns {Promise<Object|null>} Updated KYC document
 */
const rejectKYC = async (kycId, verifiedBy) => {
  return KYC.findByIdAndUpdate(
    kycId,
    {
      status: "rejected",
      verifiedAt: new Date(),
      verifiedBy,
    },
    { new: true }
  );
};

/**
 * Get KYC records by status
 * @param {String} status - KYC status
 * @returns {Promise<Array>} Array of KYC documents
 */
const findKYCByStatus = async (status) => {
  return KYC.find({ status }).sort({ createdAt: -1 }).populate("userId", "email fullName");
};

module.exports = {
  createKYC,
  findKYCByUserId,
  findAllKYCByUserId,
  findKYCById,
  updateKYC,
  updateKYCByUserId,
  deleteKYC,
  verifyKYC,
  rejectKYC,
  findKYCByStatus,
};
