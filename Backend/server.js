import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.VITE_BACKEND_PORT || 5000;
const SECRET = process.env.VITE_BACKEND_SECRET_TOKEN;
const SALT_ROUNDS = 10;

let client;

/* -------------------- DB CONNECTION -------------------- */
const initializeDBAndServer = async () => {
  try {
    client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
    await client.connect();

    // Hard check for native driver
    await client.db("admin").command({ ping: 1 });

    // Also connect Mongoose for schema/model usage (KYC storage)
    try {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BharatSurakshaDB", {
        // mongoose 8+ doesn't require these, but safe defaults
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Mongoose connected successfully");
    } catch (mErr) {
      console.warn("⚠️ Mongoose connection warning:", mErr.message);
    }

    // Ensure users collection has an index on `name` for future queries/admin use
    try {
      await client.db("AuthDB").collection("users").createIndex({ name: 1 });
    } catch (idxErr) {
      // Index creation shouldn't block server start
      console.warn("Could not create name index:", idxErr.message);
    }

    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

initializeDBAndServer();

/* -------------------- JWT MIDDLEWARE -------------------- */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "JWT Token Missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Invalid JWT Token" });
    }
    req.userId = payload.userId;
    next();
  });
};

/* -------------------- KYC MODEL + ROUTE -------------------- */
// Flexible schema to accept arbitrary KYC JSON payloads; timestamps added
const kycSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Kyc = mongoose.models.Kyc || mongoose.model("Kyc", kycSchema);

// Save incoming KYC JSON to DB
app.post("/api/kyc", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "Empty payload" });
    }

    const saved = await Kyc.create(payload);

    // Return the shape expected by the frontend: { success: true, data: { kycId } }
    res.status(200).json({ success: true, data: { kycId: saved._id } });
  } catch (err) {
    console.error("KYC SAVE ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------------- MEDICAL INFO -------------------- */
// Flexible schema for medical information submissions
const medicalSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Medical = mongoose.models.Medical || mongoose.model("Medical", medicalSchema);

// Save incoming medical JSON to DB
app.post("/api/medical", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: "Empty payload" });
    }

    const saved = await Medical.create(payload);

    // Return the shape expected by the frontend: { success: true, data: { medicalInfoId } }
    res.status(200).json({ success: true, data: { medicalInfoId: saved._id } });
  } catch (err) {
    console.error("MEDICAL SAVE ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------------- REGISTER -------------------- */
app.post("/register", async (req, res) => {
  try {

    const { email, password, mobile, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Name validation for new users
    if (!name || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
      return res.status(400).json({ error: "Name is required and must be 2-50 characters" });
    }

    const collection = client.db("AuthDB").collection("users");

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);


    const result = await collection.insertOne({
      name: name.trim(),
      email,
      mobile,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User Registered Successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------------- LOGIN -------------------- */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const collection = client.db("AuthDB").collection("users");
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      SECRET,
      { expiresIn: "1d" }
    );

    // Provide name in response; if missing for existing users, fallback to email prefix
    const displayName = user.name && typeof user.name === "string" && user.name.trim().length > 0
      ? user.name
      : (user.email ? user.email.split("@")[0] : "User");

    res.json({
      message: "Login Successful",
      jwtToken: token,
      userId: user._id,
      userData: {
        name: displayName,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------------- PROTECTED TEST -------------------- */
app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.userId,
  });
});
