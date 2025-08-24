const { authenticateToken } = require("../middleware/auth.middleware");
const {
  addReview,
  updateReview,
  deleteReview,
  getAllReview,
  getSingleReview,
} = require("./../controllers/review.controller");
const express = require("express");
const router = express.Router();

router.post("/", authenticateToken, addReview);
router.get("/", getAllReview);
router.get("/:id", getSingleReview);
router.put("/:id", authenticateToken, updateReview);
router.delete("/:id", authenticateToken, deleteReview);
module.exports = router;
