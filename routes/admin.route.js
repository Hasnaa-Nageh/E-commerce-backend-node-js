const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { authorizeRole } = require("../middleware/authorizeRole.middleware");

const userRouter = require("./user.route");
// const categoryRouter = require("./category.routes");
const subCategoryRouter = require("./subCategory.route");
const brandRouter = require("./brand.routes");
const productRouter = require("./product.route");
const orderRouter = require("./order.route");
// const couponRouter = require("./coupon.route");
const reviewRouter = require("./review.routes");

router.use(authenticateToken, authorizeRole("admin"));

router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/sub-categories", subCategoryRouter);
// router.use("/brands", brandRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
// router.use("/coupons", couponRouter);
router.use("/reviews", reviewRouter);

module.exports = router;
