import User from "../models/user.model.js";
import Company from "../models/company.model.js";
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

    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

    res.status(statusCode).json({
        success: true,
        message,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            inviteCode: user.inviteCode
        },
    });
};


// 📝 REGISTER
export const registerUserController = async (req, res) => {
    try {
        const { name, email, password, role, companyName, inviteCode } = req.body;
        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Determine company ID logic based on role
        let finalCompanyId = null;
        const userRole = role || "agent";

        if (userRole === "admin") {
            // Auto-create a company (tenant) for the admin
            if (!companyName) {
                return res.status(400).json({
                    success: false,
                    message: "Company name is required for admin registration",
                });
            }
            const newCompany = await Company.create({
                name: companyName,
                email: email, // Linking admin's email to company
            });
            finalCompanyId = newCompany._id;
        } else if (userRole === "agent") {
             // Agent must be associated with an existing company using an invite code
             if (!inviteCode) {
                 return res.status(400).json({
                    success: false,
                    message: "Company invite code is required for agent registration",
                 });
             }
             
             // Look up the company by its unique API Key / Invite Code
             const normalizedCode = inviteCode.trim().toLowerCase();
             const company = await Company.findOne({ apiKey: normalizedCode });
             if (!company) {
                 return res.status(400).json({
                     success: false,
                     message: `Invalid invite code: ${inviteCode}. Please check with your administrator.`,
                 });
             }
             finalCompanyId = company._id;
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            companyId: finalCompanyId,
        });

        // ✅ auto login after register
        const company = finalCompanyId ? await Company.findById(finalCompanyId) : null;
        
        await sendTokenResponse({
            ...user.toObject(),
            inviteCode: company?.apiKey
        }, res, "User registered successfully", 201);

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
        const { email, password, role } = req.body;

        // check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // 🛡️ Role Verification
        if (role && user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `This account is registered as an ${user.role}. Please login through the correct portal.`,
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

// 👥 GET ALL AGENTS (FOR ADMIN)
export const getAgentsController = async (req, res) => {
    try {
        const agents = await User.find({ 
            companyId: req.user.companyId,
            role: "agent" 
        }).select("name email _id");

        res.status(200).json({
            success: true,
            agents,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};