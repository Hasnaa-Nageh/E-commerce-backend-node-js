const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  // const token = req.cookies.accessToken;
  // if (!token) {
  //   return res.status(401).json({ message: "Not authenticated" });
  // }

  // try {
  //   const payload = jwt.verify(token, process.env.ACCESS_TOKEN);
  //   req.user = payload; // هنا نخزن معلومات اليوزر في req.user
  //   next();
  // } catch (err) {
  //   return res.status(403).json({ message: "Invalid or expired token" });
  // }
}

module.exports = { authenticateToken };
