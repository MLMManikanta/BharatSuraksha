const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const { generatePolicyNumberSync, generateTransactionIdSync } = require("../utils/policyNumberGenerator");

const register = async (req, res) => {
  try {
    // Accept either: { policyNumber, password, plan, transactionId? } OR { plan, password }
    const { policyNumber, plan, password, fullName, email, mobileNumber, transactionId } = req.body;

    if (!password) return res.status(400).json({ message: "Password is required" });

    let user;

    // If caller provided a policyNumber, ensure it's unique and attach plan if provided
    if (policyNumber) {
      const normalizedPolicy = String(policyNumber).toUpperCase().trim();
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
      // Allow registration without plan/policyNumber so users can create an account first
      user = await userService.createUser({
        fullName,
        email,
        mobileNumber,
        password,
        planName: plan,
        transactionId,
      });
    }

    return res.status(201).json({
      message: "Registration successful",
      userId: user._id,
      policyNumber: user.policyNumber,
      plan: user.plan,
      transactionId: user.transactionId,
      email: user.email,
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
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }

    // Try finding by email/mobile first
    let userWithPassword = await userService.findUserByIdentifier(identifier, true);

    // If not found, try policy number
    if (!userWithPassword) {
      userWithPassword = await userService.findUserByPolicyNumber(identifier, true);
    }

    if (!userWithPassword) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await userWithPassword.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = process.env.JWT_SECRET ? jwt.sign({ userId: userWithPassword._id }, process.env.JWT_SECRET) : null;

    return res.json({
      message: "Login successful",
      userId: userWithPassword._id,
      role: userWithPassword.role || 'user',
      email: userWithPassword.email,
      policyNumber: userWithPassword.policyNumber,
      isProfileComplete: userWithPassword.isProfileComplete,
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
