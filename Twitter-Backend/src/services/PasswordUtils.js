const bcrypt = require('bcrypt');

const verifyPassword = async (password, hash) => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error(err);
    return null;
  }
};
const verifyUserPassword = (user, password) => {
    return verifyPassword(password, user.password);
  };
  
  module.exports = { verifyPassword, hashPassword, verifyUserPassword };
