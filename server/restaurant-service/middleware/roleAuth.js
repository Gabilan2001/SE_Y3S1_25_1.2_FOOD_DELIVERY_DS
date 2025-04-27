export default function roleAuth(req, res, next) {
    try {
        const user = req.user;  // `req.user` should be set by the `auth` middleware

        console.log("User in roleAuth middleware:", user);  // Debugging: Check the user object

        // Check if the user is either an Admin or a Restaurant Owner
        if (!user || !(user.isAdmin || user.role === 'RESTAURANT')) {
            console.log("Access denied. User role:", user.role);  // Debugging: Access denied based on role
            return res.status(403).json({
                message: "Access denied. Admins or Restaurant Owners only.",
                error: true,
                success: false,
            });
        }

        next();

    } catch (error) {
        console.log("Error in roleAuth middleware:", error);  // Debugging: Error message in roleAuth middleware
        return res.status(500).json({
            message: "Server error during role authentication.",
            error: true,
            success: false,
        });
    }
}
