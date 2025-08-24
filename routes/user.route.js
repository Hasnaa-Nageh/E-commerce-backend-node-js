const { authenticateToken } = require("../middleware/auth.middleware");
const { authorizeRole } = require("../middleware/authorizeRole.middleware");
const {
  addUser,
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
} = require("./../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.post("/", authenticateToken, authorizeRole("admin"), addUser);
router.get("/", getAllUser);
router.get("/:id", getSingleUser);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateUser);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteUser);

// Profile
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profile.controller");

// Profile routes
router.get("/me", authenticateToken, getProfile);
router.put("/me", authenticateToken, updateProfile);
router.delete("/me", authenticateToken, deleteProfile);

module.exports = router;

module.exports = router;
