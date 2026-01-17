const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

const register = async (req, res, next) => {
  try {
    const { fullName, email, mobileNumber, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await userService.createUser({
      fullName,
      email,
      mobileNumber,
      password,
      role,
    });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userService.findUserByEmail(email, true);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};
