require("dotenv").config();
const jwt = require("jsonwebtoken");
const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  const secretKey = process.env.ACCESS_TOKEN;
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, secretKey, options);
};

const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
  };
  const secretKey = process.env.REFRESH_TOKEN;
  const options = { expiresIn: "7d" };
  return jwt.sign(payload, secretKey, options);
};

module.exports = { generateAccessToken, generateRefreshToken };
