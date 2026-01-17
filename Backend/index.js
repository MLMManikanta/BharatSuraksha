require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const userService = require("./src/services/userService");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    if (process.env.NODE_ENV === "development") {
      const testUser = await userService.ensureTestUser();
      if (testUser) {
        console.log("Test user ready:", testUser.email);
      }
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();