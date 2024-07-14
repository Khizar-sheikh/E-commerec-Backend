const jwt = require('jsonwebtoken');
const User = require('../models/User');

const manageCart = async (req, res, next) => {
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : null;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
                req.isGuest = false;
            } else {
                req.isGuest = true;
            }
        } catch (error) {
            req.isGuest = true;
        }
    } else {
        req.isGuest = true;
    }
    next();
};

module.exports = manageCart;
