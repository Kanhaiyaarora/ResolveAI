import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";

// 🔐 Generate Token + Send Response
const sendTokenResponse = async (user, res, message, statusCode = 200) => {
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
            companyId: user.companyId
        },
        CONFIG.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(statusCode).json({
        success: true,
        message,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};


// 📝 REGISTER
export const registerUserController = async (req, res) => {
    try {
        const { name, email, password, role, companyId } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "agent",
            companyId,
        });

        // ✅ auto login after register
        await sendTokenResponse(user, res, "User registered successfully", 201);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// 🔑 LOGIN
export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // ✅ send token
        await sendTokenResponse(user, res, "Login successful");

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// 🚪 LOGOUT
export const logoutUserController = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // instantly expire cookie
      sameSite: "strict",
      secure: false, // keep false for localhost (HTTP)
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 👤 GET CURRENT USER
export const getMeController = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};