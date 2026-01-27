const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
console.log("API Base URL:", BASE_URL);

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.auth ? getAuthHeaders() : {}),
      ...(options.headers || {}),
    },
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) =>
    request(path, { ...options, method: "POST", body }),
  patch: (path, body, options = {}) =>
    request(path, { ...options, method: "PATCH", body }),
};

// ====================================================================
// VAJRA Premium API Functions
// ====================================================================

/**
 * Calculate VAJRA premium for a given configuration
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} Premium calculation result
 */
export const calculateVajraPremium = async (config) => {
  return api.post('/api/vajra/calculate', config);
};

/**
 * Get VAJRA feature costs for coverage and age
 * @param {string} coverage - Coverage key (10L, 15L, etc.)
 * @param {number} age - Member age
 * @returns {Promise<Object>} Features with costs
 */
export const getVajraFeatures = async (coverage = '10L', age = 30) => {
  return api.get(`/api/vajra/features?coverage=${coverage}&age=${age}`);
};

/**
 * Get VAJRA rider costs for coverage, age and tenure
 * @param {string} coverage - Coverage key
 * @param {number} age - Member age
 * @param {number} tenure - Plan tenure
 * @returns {Promise<Object>} Riders with costs
 */
export const getVajraRiders = async (coverage = '10L', age = 30, tenure = 1) => {
  return api.get(`/api/vajra/riders?coverage=${coverage}&age=${age}&tenure=${tenure}`);
};

/**
 * Get VAJRA chronic condition costs
 * @param {string} coverage - Coverage key
 * @param {number} age - Member age
 * @returns {Promise<Object>} Chronic conditions with costs
 */
export const getVajraChronicCosts = async (coverage = '10L', age = 30) => {
  return api.get(`/api/vajra/chronic?coverage=${coverage}&age=${age}`);
};

/**
 * Get all VAJRA pricing data
 * @param {string} coverage - Coverage key
 * @param {number} age - Member age
 * @param {number} tenure - Plan tenure
 * @returns {Promise<Object>} All pricing data
 */
export const getVajraPricing = async (coverage = '10L', age = 30, tenure = 1) => {
  return api.get(`/api/vajra/pricing?coverage=${coverage}&age=${age}&tenure=${tenure}`);
};

// ====================================================================
// KYC API Functions
// ====================================================================

/**
 * Submit KYC details
 * @param {Object} kycData - KYC data object
 * @returns {Promise<Object>} Submission result
 */
export const submitKYC = async (kycData) => {
  return api.post('/api/kyc', kycData, { auth: true });
};

/**
 * Get KYC details for logged-in user
 * @returns {Promise<Object>} KYC data
 */
export const getKYC = async () => {
  return api.get('/api/kyc', { auth: true });
};

/**
 * Get KYC by ID
 * @param {string} kycId - KYC document ID
 * @returns {Promise<Object>} KYC data
 */
export const getKYCById = async (kycId) => {
  return api.get(`/api/kyc/${kycId}`, { auth: true });
};

/**
 * Update KYC details
 * @param {string} kycId - KYC document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated KYC data
 */
export const updateKYC = async (kycId, updateData) => {
  return api.patch(`/api/kyc/${kycId}`, updateData, { auth: true });
};

// ====================================================================
// Medical Information API Functions
// ====================================================================

/**
 * Submit Medical Information
 * @param {Object} medicalData - Medical information data object
 * @returns {Promise<Object>} Submission result
 */
export const submitMedicalInfo = async (medicalData) => {
  return api.post('/api/medical', medicalData);
};

/**
 * Get Medical Info for logged-in user
 * @returns {Promise<Object>} Medical info data
 */
export const getMedicalInfo = async () => {
  return api.get('/api/medical', { auth: true });
};

/**
 * Get Medical Info by ID
 * @param {string} medicalInfoId - Medical info document ID
 * @returns {Promise<Object>} Medical info data
 */
export const getMedicalInfoById = async (medicalInfoId) => {
  return api.get(`/api/medical/${medicalInfoId}`);
};

/**
 * Get Medical Info by KYC ID
 * @param {string} kycId - KYC document ID
 * @returns {Promise<Object>} Medical info data
 */
export const getMedicalInfoByKycId = async (kycId) => {
  return api.get(`/api/medical/kyc/${kycId}`);
};

/**
 * Update Medical Info
 * @param {string} medicalInfoId - Medical info document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated medical info data
 */
export const updateMedicalInfo = async (medicalInfoId, updateData) => {
  return api.patch(`/api/medical/${medicalInfoId}`, updateData, { auth: true });
};

// ====================================================================
// Bank Details API Functions
// ====================================================================

/**
 * Submit Bank Details
 * @param {Object} bankData - Bank details data object
 * @returns {Promise<Object>} Submission result
 */
export const submitBankDetails = async (bankData) => {
  return api.post('/api/bank', bankData);
};

/**
 * Get Bank Details for logged-in user
 * @returns {Promise<Object>} Bank details data
 */
export const getBankDetails = async () => {
  return api.get('/api/bank', { auth: true });
};

/**
 * Get Bank Details by ID
 * @param {string} bankDetailsId - Bank details document ID
 * @returns {Promise<Object>} Bank details data
 */
export const getBankDetailsById = async (bankDetailsId) => {
  return api.get(`/api/bank/${bankDetailsId}`);
};

/**
 * Get Bank Details by KYC ID
 * @param {string} kycId - KYC document ID
 * @returns {Promise<Object>} Bank details data
 */
export const getBankDetailsByKycId = async (kycId) => {
  return api.get(`/api/bank/kyc/${kycId}`);
};

/**
 * Update Bank Details
 * @param {string} bankDetailsId - Bank details document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated bank details data
 */
export const updateBankDetails = async (bankDetailsId, updateData) => {
  return api.patch(`/api/bank/${bankDetailsId}`, updateData, { auth: true });
};

