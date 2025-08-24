const express = require("express");
const validate = require("../middleware/validate.middleware");
const {
  addBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
} = require("./../controllers/brand.controller");
const {
  updateBrandSchema,
  createBrandSchema,
} = require("../validation/brand.validator");
const upload = require("../middleware/upload.middleware");
const { authorizeRole } = require("../middleware/authorizeRole.middleware");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("logo"),
  validate(createBrandSchema),
  addBrand
);
router.get("/", getAllBrands);
router.get("/:id", getSingleBrand);
router.put(
  "/:id",
  validate(updateBrandSchema),
  authenticateToken,
  authorizeRole("admin"),
  updateBrand
);
router.delete("/:id", authenticateToken, authorizeRole("admin"), deleteBrand);

module.exports = router;
