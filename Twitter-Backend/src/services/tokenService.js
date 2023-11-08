const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const opts = {};
opts.secretOrKey = crypto.randomBytes(64).toString('hex');

const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, opts);
};

module.exports = generateToken;
