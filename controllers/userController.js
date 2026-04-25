const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    // default role
    let userRole = role || "user";

    // force admin
    if (cleanEmail === "eyerusabebe0@gmail.com") {
      userRole = "admin";
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: cleanEmail,
      password: hashedPassword,
      phone,
      role: userRole
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "your_secret_key_here",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let userRole = user.role;

    if (cleanEmail === "eyerusabebe0@gmail.com") {
      userRole = "admin";
    }

    const token = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET || "your_secret_key_here",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: userRole
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// In authController.js - Add these functions

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Save OTP to user document
    user.resetOtp = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();
    
    // Here you would send email with OTP
    // For now, log it (in production, use nodemailer)
    console.log(`OTP for ${email}: ${otp}`);
    
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ 
      email, 
      resetOtp: otp,
      resetOtpExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ 
      email, 
      resetOtp: otp,
      resetOtpExpiry: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();
    
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add to module.exports
module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword
};