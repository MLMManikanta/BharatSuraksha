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
    const { email, password, mobile } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const collection = client.db("AuthDB").collection("users");

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await collection.insertOne({
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

    res.json({
      message: "Login Successful",
      jwtToken: token,
      userId: user._id,
      userData: {
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
