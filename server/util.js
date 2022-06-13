const bcrypt = require('bcrypt');

exports.comparePasswords = async (plainText="", hashed="") => {
  return await bcrypt.compare(plainText, hashed);
};