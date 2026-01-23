const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const customizationRoutes = require("./routes/customizationRoutes");
const userPlanRoutes = require("./routes/userPlanRoutes");
const uiRoutes = require("./routes/uiRoutes");
const claimRoutes = require("./routes/claimRoutes");
const vajraPremiumRoutes = require("./routes/vajraPremiumRoutes");
const kycRoutes = require("./routes/kycRoutes");
const medicalInfoRoutes = require("./routes/medicalInfoRoutes");
const bankDetailsRoutes = require("./routes/bankDetailsRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Temporary debug route to test saving directly
app.get("/test-save", async (req, res) => {
  const User = require("./models/User");
  try {
    const timestamp = Date.now();
    const user = await User.create({
      fullName: "Debug User",
      email: `debug${timestamp}@test.com`,
      mobileNumber: "+911234567891",
      password: "Test@123",
      policyNumber: `DEBUG-${timestamp}`,
    });
    return res.json({ saved: true, id: user._id, email: user.email });
  } catch (error) {
    console.error("/test-save error:", error);
    return res.status(500).json({ saved: false, error: error.message });
  }
});

app.use("/", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/customize", customizationRoutes);
app.use("/api/user-plans", userPlanRoutes);
app.use("/api/ui", uiRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/vajra", vajraPremiumRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/medical", medicalInfoRoutes);
app.use("/api/bank", bankDetailsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
