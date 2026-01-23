const userService = require("../services/userService");

const activatePolicy = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Authentication required" });

    const { policyNumber, planName, transactionId } = req.body;

    if (!policyNumber) return res.status(400).json({ message: "policyNumber is required" });

    const updated = await userService.attachPolicyToUser(userId, { policyNumber, planName, transactionId });

    return res.json({ message: "Policy activated", user: updated });
  } catch (error) {
    console.error("/policies/activate error", error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Policy number already exists" });
    }
    return res.status(500).json({ message: error.message || "Activation failed" });
  }
};

module.exports = { activatePolicy };
