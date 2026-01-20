/**
 * VAJRA Premium Controller
 * Handles API requests for VAJRA Suraksha premium calculations
 */
const vajraPremiumService = require('../services/vajraPremiumService');

/**
 * POST /api/vajra/calculate
 * Calculate premium for VAJRA configuration
 */
const calculatePremium = async (req, res, next) => {
  try {
    const config = req.body;
    
    // Validate required fields
    if (!config.sumInsured && !config.coverageKey) {
      return res.status(400).json({
        success: false,
        message: 'Sum insured or coverage key is required'
      });
    }
    
    if ((!config.ages || config.ages.length === 0) && 
        (!config.members || config.members.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'At least one member age is required'
      });
    }
    
    const result = await vajraPremiumService.calculatePremium(config);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vajra/features
 * Get all available features with costs
 */
const getFeatures = async (req, res, next) => {
  try {
    const { coverage = '10L', age = '30' } = req.query;
    const features = await vajraPremiumService.getFeatureCosts(coverage, parseInt(age));
    
    res.json({
      success: true,
      data: features
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vajra/riders
 * Get all available riders with costs
 */
const getRiders = async (req, res, next) => {
  try {
    const { coverage = '10L', age = '30', tenure = '1' } = req.query;
    const riders = await vajraPremiumService.getRiderCosts(
      coverage, 
      parseInt(age), 
      parseInt(tenure)
    );
    
    res.json({
      success: true,
      data: riders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vajra/chronic
 * Get all available chronic condition costs
 */
const getChronicCosts = async (req, res, next) => {
  try {
    const { coverage = '10L', age = '30' } = req.query;
    const conditions = await vajraPremiumService.getChronicCosts(coverage, parseInt(age));
    
    res.json({
      success: true,
      data: conditions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vajra/pricing
 * Get all pricing data (features, riders, chronic) for coverage and age
 */
const getAllPricing = async (req, res, next) => {
  try {
    const { coverage = '10L', age = '30', tenure = '1' } = req.query;
    const pricing = await vajraPremiumService.getAllPricing(
      coverage,
      parseInt(age),
      parseInt(tenure)
    );
    
    res.json({
      success: true,
      data: pricing
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculatePremium,
  getFeatures,
  getRiders,
  getChronicCosts,
  getAllPricing
};
