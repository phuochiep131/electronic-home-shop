const jwt = require('jsonwebtoken');
const config = require('../config/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const secretKey = config.SECRET_KEY;
        const decoded = jwt.verify(token, secretKey); // Giải mã token để lấy { id, role }

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found in database' });
        }
        req.user = user;
        
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden - Admin access required' });
    } 
    next();
};

module.exports = { authenticate, isAdmin };