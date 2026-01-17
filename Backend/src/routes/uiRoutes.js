const express = require("express");
const uiController = require("../controllers/uiController");

const router = express.Router();

router.get("/plans", uiController.getPlansUi);
router.get("/plans/:id", uiController.getPlanUiById);
router.get("/customization-options/:planId", uiController.getCustomizationOptionsUi);

module.exports = router;
