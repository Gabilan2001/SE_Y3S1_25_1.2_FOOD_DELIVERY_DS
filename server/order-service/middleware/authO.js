const jwt = require('jsonwebtoken');

const authO = (req, res, next) => {
    // Check the Authorization header first
    const token = req.header('Authorization')?.split(' ')[1] || req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing' });
    }

    try {
        // Verify the token using JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;  // Attach userId to the request object
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authO;
