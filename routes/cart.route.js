const {
  addToCart,
  getAllCart,
  updateItemQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cart.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const express = require("express");
const router = express.Router();

// user cart routes
router.post("/", authenticateToken, addToCart);
router.get("/", authenticateToken, getAllCart);
router.put("/:productId", authenticateToken, updateItemQuantity);
router.delete("/:productId", authenticateToken, removeItem);
router.delete("/", authenticateToken, clearCart);

module.exports = router;
