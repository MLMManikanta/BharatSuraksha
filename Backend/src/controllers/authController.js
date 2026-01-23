const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const { generatePolicyNumberSync, generateTransactionIdSync } = require("../utils/policyNumberGenerator");

const register = async (req, res) => {
  try {
    // Accept either: { policyNumber, password, plan, transactionId? } OR { plan, password }
    const { policyNumber, plan, password, fullName, email, mobileNumber, transactionId } = req.body;

    if (!password) return res.status(400).json({ message: "Password is required" });

    let user;

    if (policyNumber) {
      // If caller provided a policyNumber, require plan as well (to set the required field)
      if (!plan) return res.status(400).json({ message: "Plan is required when providing policyNumber" });

      // Ensure policyNumber is uppercased and trimmed
      const normalizedPolicy = String(policyNumber).toUpperCase().trim();

      // Check collision
      const existing = await userService.findUserByPolicyNumber(normalizedPolicy);
      if (existing) return res.status(409).json({ message: "Policy number already exists" });

      user = await userService.createUser({
        fullName,
        email,
        mobileNumber,
        password,
        policyNumber: normalizedPolicy,
        planName: plan,
        transactionId,
      });
    } else {
      // Plan must be provided to generate a policy number
      if (!plan) return res.status(400).json({ message: "Plan is required" });

      user = await userService.createUser({
        fullName,
        email,
        mobileNumber,
        password,
        planName: plan,
      });
    }

    return res.status(201).json({
      message: "Registration successful",
      policyNumber: user.policyNumber,
      plan: user.plan,
      transactionId: user.transactionId,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Policy number already exists" });
    }
    return res.status(500).json({ message: `Registration failed: ${error.message}` });
  }
};

const generate = async (req, res) => {
  try {
    const plan = req.query.plan;
    if (!plan) return res.status(400).json({ message: "plan query param is required" });

    // synchronous generation for preview
    const policyNumber = generatePolicyNumberSync(plan);
    const transactionId = generateTransactionIdSync();

    return res.json({ policyNumber, transactionId });
  } catch (error) {
    console.error("/generate error", error);
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { policyNumber, password } = req.body;
    if (!policyNumber || !password) {
      return res.status(400).json({ message: "Policy number and password are required" });
    }

    const user = await userService.findUserByPolicyNumber(policyNumber);
    if (!user) return res.status(401).json({ message: "Invalid policy number or password" });

    // need password selected
    const userWithPassword = await userService.findUserByPolicyNumber(policyNumber, true);
    if (!userWithPassword) return res.status(401).json({ message: "Invalid policy number or password" });

    const isMatch = await userWithPassword.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid policy number or password" });

    const token = process.env.JWT_SECRET ? jwt.sign({ userId: user._id }, process.env.JWT_SECRET) : null;

    return res.json({
      message: "Login successful",
      policyNumber: user.policyNumber,
      plan: user.plan,
      isProfileComplete: user.isProfileComplete,
      jwtToken: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Login failed: ${error.message}` });
  }
};

module.exports = {
  register,
  login,
  generate,
};
