const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { authorizeRole } = require("../middleware/authorizeRole.middleware");

// user
router.post("/", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getMyOrders);

// admin
router.get("/", authenticateToken, authorizeRole("admin"), getAllOrders);
router.put("/:id", authenticateToken, authorizeRole("admin"), updateOrderStatus);

module.exports = router;
