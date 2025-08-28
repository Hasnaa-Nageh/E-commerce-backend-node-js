const express = require("express");
const {
  addSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  UpdateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategory.controller");
const {
  createSubCategorySchema,
  updateSubCategorySchema,
} = require("../validation/subCategory.validation");
const validate = require("../middleware/validate.middleware");
const { authorizeRole } = require("../middleware/authorizeRole.middleware");
const { authenticateToken } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  upload.single("imageSub"),
  validate(createSubCategorySchema),
  addSubCategory
);

subCategoryRouter.get("/", getAllSubCategories);
subCategoryRouter.get("/:id", getSingleSubCategory);
subCategoryRouter.put(
  "/:id",
  upload.single("imageSub"),
  validate(updateSubCategorySchema),
  authenticateToken,
  authorizeRole("admin"),
  UpdateSubCategory
);
subCategoryRouter.delete(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteSubCategory
);

module.exports = subCategoryRouter;
