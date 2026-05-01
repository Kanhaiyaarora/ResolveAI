import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";
import UserModel from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
    try {
        let token;

        //  1. Check Authorization header
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        //  2. Check cookies
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        //  No token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, token missing",
            });
        }

        //  3. Verify token
        const decoded = jwt.verify(token, CONFIG.JWT_SECRET);

        //  Optional: check payload safety
        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
            });
        }

        
        //  4. Fetch user
        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        //  Optional but important: block inactive users
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated",
            });
        }

        //  5. Attach user to request
        req.user = user;

        next();

    } catch (error) {
        console.error("Auth Error:", error.message);

        let message = "Invalid token";

        if (error.name === "TokenExpiredError") {
            message = "Token expired";
        } else if (error.name === "JsonWebTokenError") {
            message = "Malformed token";
        }

        return res.status(401).json({
            success: false,
            message,
        });
    }
};