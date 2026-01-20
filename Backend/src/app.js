const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const customizationRoutes = require("./routes/customizationRoutes");
const userPlanRoutes = require("./routes/userPlanRoutes");
const uiRoutes = require("./routes/uiRoutes");
const claimRoutes = require("./routes/claimRoutes");
const vajraPremiumRoutes = require("./routes/vajraPremiumRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/customize", customizationRoutes);
app.use("/api/user-plans", userPlanRoutes);
app.use("/api/ui", uiRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/vajra", vajraPremiumRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
