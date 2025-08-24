const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, userData) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.user = userData;
    next();
  });
}

module.exports = { authenticateToken };
