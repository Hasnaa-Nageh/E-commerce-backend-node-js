const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const categoryRouter = require("./routes/category.routes");
const subCategoryRoute = require("./routes/subCategory.route");
const brandRouter = require("./routes/brand.routes");
const productRoute = require("./routes/product.route");
const userRouter = require("./routes/user.route");
const ReviewRoute = require("./routes/review.routes");
const wishListRoute = require("./routes/wishList.route");
const addressRoute = require("./routes/address.route");
// const couponRoute = require("./routes/coupon.route");
const cartRoute = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");
const adminRouter = require("./routes/admin.route");

const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/sub-category", subCategoryRoute);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRoute);
app.use("/api/review", ReviewRoute);
app.use("/api/wish-list", wishListRoute);
app.use("/api/address", addressRoute);
// app.use("/api/coupon", couponRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoutes);
// dashboard routes
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

app.use(errorHandler);

module.exports = app;
