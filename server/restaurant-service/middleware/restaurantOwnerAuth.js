import UserModel from "../models/user.model.js";

export const restaurantOwnerAuth = async (request, response, next) => {
    try {
        const userId = request.userId;
        const user = await UserModel.findById(userId);

        if (!["ADMIN", "RESTAURANT"].includes(user?.role)) {
            return response.status(403).json({
                message: "Permission denied. Only admins and restaurant owners are allowed.",
                error: true,
                success: false,
            });
        }

        next();
    } catch (error) {
        return response.status(500).json({
            message: "Permission denied",
            error: true,
            success: false,
        });
    }
};