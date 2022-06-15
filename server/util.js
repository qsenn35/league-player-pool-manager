const bcrypt = require('bcrypt');
const secret = require('./secret');
const jwt = require("jsonwebtoken");

exports.getAccessToken = (headers) => headers.authorization ? headers.authorization.split(' ')[1] : null;

exports.verifyToken = (token) => {
  try {
      const verify = jwt.verify(token, secret.TOKEN_SECRET);

      if (verify.username)
        return true;
      else
        return false;
  } catch (error) {
      return false;
  }
}

exports.comparePasswords = async (plainText="", hashed="") => {
  return await bcrypt.compare(plainText, hashed);
};