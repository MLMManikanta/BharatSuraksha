const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const policyController = require('../controllers/policyController');

const router = express.Router();

// POST /api/policies/activate
router.post('/activate', authenticate, policyController.activatePolicy);

module.exports = router;
