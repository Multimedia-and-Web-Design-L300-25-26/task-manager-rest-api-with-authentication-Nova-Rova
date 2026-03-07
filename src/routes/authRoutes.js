import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  // - Validate input
  // - Check if user exists
  // - Hash password
  // - Save user
  // - Return user (without password)
  const user = req.body;
  const { name, email, password } = user;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    name,
    email,
    password: hashedPassword
  });
  await newUser.save();
  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email
  });

});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  // - Find user
  // - Compare password
  // - Generate JWT
  // - Return token
  const {email,password} = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

export default router;