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

const kycSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Kyc = mongoose.models.Kyc || mongoose.model("Kyc", kycSchema);

const medicalInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  kycId: { type: mongoose.Schema.Types.ObjectId, ref: "Kyc" }
}, { strict: false, timestamps: true });

const MedicalInfo = mongoose.models.MedicalInfo || mongoose.model("MedicalInfo", medicalInfoSchema);

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  kycId: { type: mongoose.Schema.Types.ObjectId, ref: "Kyc" },
  medicalInfoId: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalInfo" }
}, { strict: false, timestamps: true });

const BankDetails = mongoose.models.BankDetails || mongoose.model("BankDetails", bankDetailsSchema);

// Decode JWT when provided but do not force auth for medical submission
const getUserIdFromAuthHeader = (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    return payload.userId;
  } catch (err) {
    return null;
  }
};

/* -------------------- CLAIMS ROUTES -------------------- */

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

/* -------------------- KYC & AUTH ROUTES -------------------- */

app.post("/api/kyc", async (req, res) => {
  try {
    const saved = await Kyc.create(req.body);
    res.status(200).json({ success: true, data: { kycId: saved._id } });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------------- MEDICAL ROUTES -------------------- */

app.post("/api/medical", async (req, res) => {
  try {
    const userId = getUserIdFromAuthHeader(req.headers.authorization) || req.body.userId || null;
    const payload = { ...req.body, ...(userId ? { userId } : {}) };
    const saved = await MedicalInfo.create(payload);

    res.status(201).json({ success: true, data: { medicalInfoId: saved._id } });
  } catch (err) {
    console.error("POST /api/medical error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* -------------------- BANK DETAILS ROUTES -------------------- */

app.post("/api/bank", async (req, res) => {
  try {
    const userId = getUserIdFromAuthHeader(req.headers.authorization) || req.body.userId || null;
    const payload = { ...req.body, ...(userId ? { userId } : {}) };
    const saved = await BankDetails.create(payload);
    res.status(201).json({ success: true, data: { bankDetailsId: saved._id } });
  } catch (err) {
    console.error("POST /api/bank error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/bank", authenticateToken, async (req, res) => {
  try {
    const bankDocs = await BankDetails.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(bankDocs);
  } catch (err) {
    console.error("GET /api/bank error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/bank/:id", async (req, res) => {
  try {
    const doc = await BankDetails.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Bank details not found" });
    res.status(200).json(doc);
  } catch (err) {
    console.error("GET /api/bank/:id error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/bank/kyc/:kycId", async (req, res) => {
  try {
    const doc = await BankDetails.findOne({ kycId: req.params.kycId }).sort({ createdAt: -1 });
    if (!doc) return res.status(404).json({ error: "Bank details not found" });
    res.status(200).json(doc);
  } catch (err) {
    console.error("GET /api/bank/kyc/:kycId error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/bank/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await BankDetails.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Bank details not found" });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/bank/:id error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
      jwtToken: token, 
      userId: user._id,
      userData: { name: user.name, email: user.email, mobile: user.mobile },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// FETCH SINGLE CLAIM BY ID
app.get("/api/claims/:id", authenticateToken, async (req, res) => {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, userId: req.userId });
    if (!claim) return res.status(404).json({ error: "Claim not found" });
    res.status(200).json(claim);
  } catch (err) {
    console.error("GET /api/claim/:id error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});