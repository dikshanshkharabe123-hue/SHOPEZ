const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token and authenticate user
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }

        req.user = {
            userId: user._id,
            username: user.username,
            email: user.email,
            usertype: user.usertype
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

// Admin authorization middleware
const adminAuth = (req, res, next) => {
    if (req.user.usertype !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required'
        });
    }
    next();
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');

            if (user) {
                req.user = {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    usertype: user.usertype
                };
            }
        }

        next();
    } catch (error) {
        // If token is invalid, continue without user (don't throw error)
        next();
    }
};

module.exports = {
    auth,
    adminAuth,
    optionalAuth
};