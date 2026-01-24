import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
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
    client = new MongoClient("mongodb://localhost:27017");
    await client.connect();

    // Hard check
    await client.db("admin").command({ ping: 1 });

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
