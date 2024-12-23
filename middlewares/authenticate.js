const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { JWT_TOKEN } = process.env;

const authenticate = async (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }

    const token = authorizationHeader.split(' ')[1];

    try {
        const { userId } = jwt.verify(token, JWT_TOKEN);
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(403).json({ success: false, message: 'User not found' });
        }

        req.user = { id: userId };
        next();
    } catch (err) {
        res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }
};

module.exports = { authenticate };