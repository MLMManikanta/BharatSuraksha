const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
