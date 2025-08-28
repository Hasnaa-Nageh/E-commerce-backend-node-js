const express = require("express");
const {
  addCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
  getSingleCategory,
} = require("../controllers/category.controller");

const upload = require("../middleware/upload.middleware");
const subCategoryRoute = require("./../routes/subCategory.route");
const { authenticateToken } = require("../middleware/auth.middleware");
const { authorizeRole } = require("../middleware/authorizeRole.middleware");
const router = express.Router();

router.use("/:id/sub-category", subCategoryRoute);
// admin only
router.post(
  "/",
  // authenticateToken,
  // authorizeRole("admin"),
  upload.single("image"),
  addCategory
);
router.get("/", getAllCategories);
router.get("/:id", getSingleCategory);
router.put(
  "/:id",
  //  authenticateToken,
  upload.single("image"),
  updateCategory
);
router.delete(
  "/:id",
  // authenticateToken,
  // authorizeRole("admin"),
  deleteCategory
);

module.exports = router;
