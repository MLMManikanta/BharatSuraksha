const express = require("express");
const planController = require("../controllers/planController");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", planController.getAllPlans);
router.get("/:id", planController.getPlanById);

router.post("/", authenticate, authorizeRoles("admin"), planController.createPlan);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  planController.updatePlan
);
router.patch(
  "/:id/disable",
  authenticate,
  authorizeRoles("admin"),
  planController.disablePlan
);

module.exports = router;
