const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      phoneNumber,
      password,
      policyNumber,
      role,
    } = req.body;

    const normalizedEmail = (email || "").toLowerCase().trim();
    const normalizedMobileNumber = (mobileNumber || phoneNumber || "").trim();
    const normalizedPolicyNumber = (policyNumber || "").toUpperCase().trim();

    if (!normalizedEmail || !password || !normalizedMobileNumber || !normalizedPolicyNumber) {
      return res.status(400).json({
        message: "Policy number, email, mobile number, and password are required",
      });
    }

    const existingUser = await userService.findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ error_msg: "User with Email ID already Exists..!!" });
    }

    const existingPolicy = await userService.findUserByPolicyNumber(
      normalizedPolicyNumber
    );
    if (existingPolicy) {
      return res.status(409).json({ error_msg: "Policy number already registered..!!" });
    }

    const user = await userService.createUser({
      fullName,
      email: normalizedEmail,
      mobileNumber: normalizedMobileNumber,
      password,
      role,
      policyNumber: normalizedPolicyNumber,
    });

    return res.status(201).json({
      yourId: user._id,
      message: "User Registered Successfully..!!",
      email: user.email,
      policyNumber: user.policyNumber,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error_msg: `Internal server error: ${error.message}` });
  }
};

const login = async (req, res) => {
  try {
    const { email, identifier, password } = req.body;
    const loginIdentifier = (identifier || email || "").trim();

    if (!loginIdentifier || !password) {
      return res
        .status(400)
        .json({ error_msg: "Email or mobile number and password are required" });
    }

    const user = await userService.findUserByIdentifier(loginIdentifier, true);
    if (!user) {
      return res.status(401).json({ error_msg: "Email ID doesn't Exists..!!" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error_msg: "Incorrect Password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error_msg: "JWT secret not configured" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    return res.status(200).json({
      jwtToken: token,
      userId: user._id,
      userData: {
        email: user.email,
        mobileNumber: user.mobileNumber,
        policyNumber: user.policyNumber,
        fullName: user.fullName,
      },
      isUserExists: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error_msg: `Internal Server Error: ${error.message}` });
  }
};

module.exports = {
  register,
  login,
};
