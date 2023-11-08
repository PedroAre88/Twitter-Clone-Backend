const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const generateToken = require('../services/tokenService')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, generateToken.generateToken);
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            throw 'Usuario no válido';
        } else {
            req.user = user;
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Solicitud no autenticada')
        });
    }
};
