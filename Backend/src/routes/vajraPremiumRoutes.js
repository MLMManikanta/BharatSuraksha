/**
 * VAJRA Premium Routes
 * API endpoints for VAJRA Suraksha premium calculations
 */
const express = require('express');
const router = express.Router();
const vajraPremiumController = require('../controllers/vajraPremiumController');

// Calculate premium for a configuration
// POST /api/vajra/calculate
// Body: { sumInsured, ages, features, riders, chronicConditions, tenure, preHosp, postHosp }
router.post('/calculate', vajraPremiumController.calculatePremium);

// Get feature costs for coverage and age
// GET /api/vajra/features?coverage=10L&age=30
router.get('/features', vajraPremiumController.getFeatures);

// Get rider costs for coverage, age and tenure
// GET /api/vajra/riders?coverage=10L&age=30&tenure=1
router.get('/riders', vajraPremiumController.getRiders);

// Get chronic condition costs for coverage and age
// GET /api/vajra/chronic?coverage=10L&age=30
router.get('/chronic', vajraPremiumController.getChronicCosts);

// Get all pricing data (features, riders, chronic)
// GET /api/vajra/pricing?coverage=10L&age=30&tenure=1
router.get('/pricing', vajraPremiumController.getAllPricing);

module.exports = router;
