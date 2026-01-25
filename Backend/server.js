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
    
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BharatSurakshaDB");
    console.log("✅ MongoDB & Mongoose connected successfully");

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
  if (!authHeader) return res.status(401).json({ error: "JWT Token Missing" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: "Invalid JWT Token" });
    req.userId = payload.userId;
    next();
  });
};

/* -------------------- MODELS -------------------- */
// Defined schema for better data integrity during retrieval
const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimType: String,
  claimCycle: String,
    hospitalizationType: String,
    referenceId: String,
  dependentId: String,
  dependentName: String,
  claimedAmount: Number,
  admissionDate: String,
  dischargeDate: String,
  hospitalAddress: String,
  diagnosis: String,
  dayCare: String,
  status: { type: String, default: "Pending" }
}, { timestamps: true });

const Claim = mongoose.models.Claim || mongoose.model("Claim", claimSchema);

/* -------------------- CLAIMS ROUTES -------------------- */

// FETCH REAL CLAIMS: Replaced mock data with actual DB query
app.get("/api/claims", authenticateToken, async (req, res) => {
  try {
    const userClaims = await Claim.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(userClaims);
  } catch (err) {
    console.error("GET /api/claims error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// CREATE CLAIM: Stores the form data from RaiseClaim.jsx
app.post("/api/claims", authenticateToken, async (req, res) => {
  try {
    const payload = { 
      ...req.body, 
      userId: req.userId,
      claimedAmount: Number(req.body.claimedAmount) // Ensure numeric storage
    };
    const saved = await Claim.create(payload);
    res.status(201).json({ success: true, data: { claimId: saved._id } });
  } catch (err) {
    console.error("POST /api/claims error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------------- OTHER SCHEMAS & ROUTES -------------------- */
const kycSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Kyc = mongoose.models.Kyc || mongoose.model("Kyc", kycSchema);

app.post("/api/kyc", async (req, res) => {
  try {
    const saved = await Kyc.create(req.body);
    res.status(200).json({ success: true, data: { kycId: saved._id } });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ... (Remaining Auth Routes from your original file) ... */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const collection = client.db("AuthDB").collection("users");
    const user = await collection.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "1d" });
    res.json({
      jwtToken: token, userId: user._id,
      userData: { name: user.name, email: user.email, mobile: user.mobile },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ... Imports remain same ... */

// FETCH REAL CLAIMS: Queries the database for the logged-in user's claims
app.get("/api/claims", authenticateToken, async (req, res) => {
  try {
    const userClaims = await Claim.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(userClaims);
  } catch (err) {
    console.error("GET /api/claims error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/claims", authenticateToken, async (req, res) => {
  try {
    const payload = { 
      ...req.body, 
      userId: req.userId,
      claimedAmount: Number(req.body.claimedAmount)
    };
    const saved = await Claim.create(payload);
    res.status(201).json({ success: true, data: { claimId: saved._id } });
  } catch (err) {
    console.error("POST /api/claims error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const claimSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  dependentName: String,
  claimType: String,
  hospitalizationType: String, 
  referenceId: String,       
  hospitalAddress: String,    
  diagnosis: String,         
  claimedAmount: Number,
  status: String,
}, { timestamps: true });