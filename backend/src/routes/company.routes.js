import { Router } from "express";
import { getWidgetSettingsController, updateWidgetSettingsController } from "../controllers/company.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const companyRouter = Router();

// 🌐 PUBLIC — Widget loads this to get colors, bot name, etc.
companyRouter.get("/widget-settings", getWidgetSettingsController);

// 🔒 PROTECTED (Admin only) — Save widget customization from dashboard
companyRouter.patch(
    "/widget-settings",
    authenticateUser,
    authorizeRoles("admin"),
    updateWidgetSettingsController
);

export default companyRouter;
