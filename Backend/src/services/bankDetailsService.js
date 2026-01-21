const BankDetails = require("../models/BankDetails");

/**
 * Create a new Bank Details record
 * @param {Object} bankData - Bank details data object
 * @returns {Promise<Object>} Created BankDetails document
 */
const createBankDetails = async (bankData) => {
  const bankDetails = await BankDetails.create(bankData);
  return bankDetails;
};

/**
 * Find Bank Details by user ID
 * @param {String} userId - User ID
 * @returns {Promise<Object|null>} BankDetails document or null
 */
const findBankDetailsByUserId = async (userId) => {
  return BankDetails.findOne({ userId }).sort({ createdAt: -1 });
};

/**
 * Find Bank Details by KYC ID
 * @param {String} kycId - KYC document ID
 * @returns {Promise<Object|null>} BankDetails document or null
 */
const findBankDetailsByKycId = async (kycId) => {
  return BankDetails.findOne({ kycId }).sort({ createdAt: -1 });
};

/**
 * Find Bank Details by Medical Info ID
 * @param {String} medicalInfoId - Medical Info document ID
 * @returns {Promise<Object|null>} BankDetails document or null
 */
const findBankDetailsByMedicalInfoId = async (medicalInfoId) => {
  return BankDetails.findOne({ medicalInfoId }).sort({ createdAt: -1 });
};

/**
 * Find all Bank Details for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} Array of BankDetails documents
 */
const findAllBankDetailsByUserId = async (userId) => {
  return BankDetails.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Find Bank Details by ID
 * @param {String} bankDetailsId - BankDetails document ID
 * @returns {Promise<Object|null>} BankDetails document or null
 */
const findBankDetailsById = async (bankDetailsId) => {
  return BankDetails.findById(bankDetailsId);
};

/**
 * Update Bank Details record
 * @param {String} bankDetailsId - BankDetails document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated BankDetails document
 */
const updateBankDetails = async (bankDetailsId, updateData) => {
  return BankDetails.findByIdAndUpdate(bankDetailsId, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Update Bank Details by KYC ID
 * @param {String} kycId - KYC document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object|null>} Updated BankDetails document
 */
const updateBankDetailsByKycId = async (kycId, updateData) => {
  return BankDetails.findOneAndUpdate(
    { kycId },
    updateData,
    { new: true, runValidators: true, sort: { createdAt: -1 } }
  );
};

/**
 * Delete Bank Details record
 * @param {String} bankDetailsId - BankDetails document ID
 * @returns {Promise<Object|null>} Deleted BankDetails document
 */
const deleteBankDetails = async (bankDetailsId) => {
  return BankDetails.findByIdAndDelete(bankDetailsId);
};

/**
 * Verify Bank Details record
 * @param {String} bankDetailsId - BankDetails document ID
 * @param {String} verifiedBy - User ID of the verifier
 * @returns {Promise<Object|null>} Updated BankDetails document
 */
const verifyBankDetails = async (bankDetailsId, verifiedBy) => {
  return BankDetails.findByIdAndUpdate(
    bankDetailsId,
    {
      status: "verified",
      verifiedAt: new Date(),
      verifiedBy,
    },
    { new: true }
  );
};

/**
 * Reject Bank Details record
 * @param {String} bankDetailsId - BankDetails document ID
 * @param {String} verifiedBy - User ID of the verifier
 * @returns {Promise<Object|null>} Updated BankDetails document
 */
const rejectBankDetails = async (bankDetailsId, verifiedBy) => {
  return BankDetails.findByIdAndUpdate(
    bankDetailsId,
    {
      status: "rejected",
      verifiedAt: new Date(),
      verifiedBy,
    },
    { new: true }
  );
};

/**
 * Get Bank Details records by status
 * @param {String} status - Bank details status
 * @returns {Promise<Array>} Array of BankDetails documents
 */
const findBankDetailsByStatus = async (status) => {
  return BankDetails.find({ status })
    .sort({ createdAt: -1 })
    .populate("userId", "email fullName")
    .populate("kycId");
};

module.exports = {
  createBankDetails,
  findBankDetailsByUserId,
  findBankDetailsByKycId,
  findBankDetailsByMedicalInfoId,
  findAllBankDetailsByUserId,
  findBankDetailsById,
  updateBankDetails,
  updateBankDetailsByKycId,
  deleteBankDetails,
  verifyBankDetails,
  rejectBankDetails,
  findBankDetailsByStatus,
};
