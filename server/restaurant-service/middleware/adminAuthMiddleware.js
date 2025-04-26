export default function adminAuth(req, res, next) {
    try {
        const user = req.user; // Assuming `req.user` is set by the `auth` middleware

        if (!user || !user.isAdmin) {
            return res.status(403).json({
                message: "Access denied. Admins only.",
                error: true,
                success: false,
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Server error during admin authentication.",
            error: true,
            success: false,
        });
    }
}
