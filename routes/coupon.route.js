const {
  addCoupon,
  getAllCoupon,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require("../controllers/coupon.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { authorizeRole } = require("../middleware/authorizeRole.middleware");

const express = require("express");
const router = express.Router();

router.post("/", authenticateToken, authorizeRole("admin"), addCoupon);
router.get("/", authenticateToken, authorizeRole("admin"), getAllCoupon);
router.get("/:id", authenticateToken, authorizeRole("admin"), getSingleCoupon);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateCoupon);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteCoupon);
router.post("/apply-coupon", authenticateToken, applyCoupon);
module.exports = router;
