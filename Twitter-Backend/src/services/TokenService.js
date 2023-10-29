const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, 'tu_secreto');
};

module.exports = generateToken;
