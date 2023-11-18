const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const secretKey = crypto.randomBytes(64).toString('hex');

const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, secretKey, { expiresIn: '1h' });
};

module.exports = generateToken;