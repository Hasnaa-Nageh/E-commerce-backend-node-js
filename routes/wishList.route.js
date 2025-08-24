const { authenticateToken } = require("../middleware/auth.middleware");
const {
  addToWishList,
  removeFromWishList,
  getWishList,
} = require("./../controllers/wishList.controller");
const express = require("express");
const router = express.Router();

router.post("/", authenticateToken, addToWishList); // POST /wishlist
router.get("/", authenticateToken, getWishList); // GET /wishlist
router.delete("/:productId", authenticateToken, removeFromWishList); // DELETE /wishlist/:productId

module.exports = router;
