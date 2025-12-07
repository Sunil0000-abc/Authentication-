const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model");
const bcrypt = require("bcrypt");
const sendEmail = require("../lib/mailer");

router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(email);
  

  try {
    const existingUser = await User.findOne({ email });

    const otp = Math.floor(1000 + Math.random() * 9000);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser && !existingUser.isVerified) {
      existingUser.otp = otp;
      existingUser.otpExpiresAt = Date.now() + 10 * 60 * 1000;
      existingUser.password = hashedPassword;

      await existingUser.save();
      await sendEmail(email, otp);

      return res
        .status(200)
        .json({ message: "OTP resent to your email", user: existingUser });
    }

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });
    await user.save();

    await sendEmail(email, otp);

    return res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/resend-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiresAt = Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await sendEmail(email, otp);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
