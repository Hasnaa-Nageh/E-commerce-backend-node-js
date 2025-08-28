const express = require("express");
const {
  signUp,
  Login,
  refreshToken,
  logOut,
  changePassword,
  me
} = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", Login);
router.post("/refresh-token", refreshToken);
router.post("/change-password", authenticateToken, changePassword);
router.post("/logout", logOut);
router.get("/me",me)
module.exports = router;
