import Company from "../models/company.model.js";

/**
 * GET /api/company/widget-settings?cid=<companyId>
 * Public endpoint — returns only safe widget settings for the chat widget to load.
 */
export const getWidgetSettingsController = async (req, res) => {
    try {
        const { cid } = req.query;
        if (!cid) {
            return res.status(400).json({ success: false, message: "Company ID (cid) is required." });
        }

        const company = await Company.findById(cid).select("name widgetSettings");
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found." });
        }

        res.status(200).json({
            success: true,
            settings: {
                companyName: company.name,
                ...company.widgetSettings.toObject(),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * PATCH /api/company/widget-settings
 * Protected (Admin) — updates the widgetSettings for the admin's own company.
 */
export const updateWidgetSettingsController = async (req, res) => {
    try {
        const companyId = req.user.companyId;
        const { primaryColor, position, welcomeMessage, botName, logoUrl } = req.body;

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            {
                $set: {
                    "widgetSettings.primaryColor": primaryColor,
                    "widgetSettings.position": position,
                    "widgetSettings.welcomeMessage": welcomeMessage,
                    "widgetSettings.botName": botName,
                    "widgetSettings.logoUrl": logoUrl,
                },
            },
            { new: true, runValidators: true }
        ).select("widgetSettings");

        res.status(200).json({
            success: true,
            message: "Widget settings updated successfully.",
            settings: updatedCompany.widgetSettings,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
