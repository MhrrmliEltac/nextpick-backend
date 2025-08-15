import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 15 * 60 * 1000,
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "meherremlieltac14@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

// generate otp
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// send otp
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        const hasFullInfo = existingUser.name && existingUser.password;

        if (!hasFullInfo) {
          return res.status(200).json({
            message:
              "Email already verified. Proceed to complete registration.",
            proceedToSignUp: true,
          });
        }
        return res.status(400).json({ message: "User already exist" });
      }

      const otp = generateOTP();
      existingUser.otpCode = otp;
      existingUser.otpExpiry = Date.now() + 10 * 60 * 1000;
      await existingUser.save();

      await transporter.sendMail({
        from: `"Verify Your Email" <meherremlieltac14@gmail.com>`,
        to: email,
        subject: `Your OTP Code is ${otp}`,
        text: `Your OTP Code is ${otp}`,
      });

      return res.status(200).json({ message: "OTP resent to your email." });
    }

    const otp = generateOTP();

    const newUser = new userModel({
      email,
      otpCode: otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    await newUser.save();

    await transporter.sendMail({
      from: `"Verify Your Email" <meherremlieltac14@gmail.com>`,
      to: email,
      subject: `Your OTP Code is ${otp}`,
      text: `Your OTP Code is ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
};

// verify otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    console.log(email, otpCode);

    const user = await userModel.findOne({ email });

    console.log(user);

    if (!user || user.otpCode !== otpCode || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // change user verified status
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// user sign up
export const signUp = async (req, res) => {
  try {
    const { name, surname, phone, email, password, birthDate, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email format not valid" });
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email not verified. Please verify OTP first." });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified. Please verify OTP first." });
    }

    if (user.name && user.password) {
      return res.status(400).json({ message: "User already signed up." });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    user.name = name;
    user.password = hashPassword;
    user.birthDate = birthDate;
    user.role = role;
    user.phone = phone;
    user.surname = surname;

    await user.save();

    res.status(201).json({ message: "User signed up successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// user sign in
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Email not verified. Please verify OTP first." });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const access_token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refresh_token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "3d",
      }
    );

    // access token
    res.cookie("access_token", access_token, cookieOptions);

    // refresh token
    res.cookie("refresh_token", refresh_token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// user sign out
export const signOut = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ message: "Signed out" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// user profile
export const profile = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// refresh access token
export const refreshAccessToken = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      return res.status(401).json({ message: "Refresh token missing." });
    }

    jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(403).json({ message: "Invalid refresh token." });

        const access_token = jwt.sign(
          {
            id: decoded.id,
          },
          process.env.JWT_REFRESH_SECRET,
          {
            expiresIn: "15m",
          }
        );

        res.cookie("access_token", access_token, cookieOptions);
        res.status(200).json({ message: "Access token refreshed." });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = generateOTP();
    user.otpCode = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"Forgot Password" <meherremlieltac14@gmail.com>`,
      to: email,
      subject: `Your OTP Code is ${otp}`,
      text: `Your OTP Code is ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// verify otp for forgot password
export const verifyOTPForForgotPassword = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || user.otpCode !== otpCode || Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Generate a reset token (JWT is self-contained)
    const resetToken = jwt.sign(
      { email: user.email, type: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Clear OTP after successful verification
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Set reset token as secure cookie
    res.cookie("reset_token", resetToken, cookieOptions);

    res.status(200).json({
      message: "OTP verified successfully.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.cookies.reset_token;

    if (!resetToken || !password) {
      return res.status(400).json({
        message: "Reset token and password are required.",
      });
    }

    // Password strength validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    if (decoded.type !== "password_reset") {
      return res.status(400).json({ message: "Invalid reset token." });
    }

    // Find user by email from JWT
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    // Update password
    user.password = hashPassword;
    await user.save();

    // Clear the reset token cookie
    res.clearCookie("reset_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
