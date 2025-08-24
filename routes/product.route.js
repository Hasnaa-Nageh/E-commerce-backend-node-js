const express = require("express");
const {
  addProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("./../controllers/product.controller");
const upload = require("../middleware/upload.middleware");
const validate = require("../middleware/validate.middleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validation/product.validation");
const { authorizeRole } = require("../middleware/authorizeRole.middleware");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  upload.fields([
    { name: "imgCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),

  addProduct
);
router.get("/",  getAllProduct);
router.get("/:id", getSingleProduct);
router.put(
  "/:id",
  validate(updateProductSchema),
  authenticateToken,
  authorizeRole("admin"),
  updateProduct
);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteProduct);

module.exports = router;
