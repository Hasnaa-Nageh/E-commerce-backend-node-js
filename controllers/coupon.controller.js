const Coupon = require("./../models/coupon.model");

const addCoupon = async (req, res, next) => {
  try {
    const { code, expires, discount } = req.body;

    const coupon = new Coupon({
      code,
      expires,
      discount,
    });

    await coupon.save();

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getAllCoupon = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getSingleCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const updateCoupon = async (req, res, next) => {
  const { code, expires, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { code, expires, discount },
    { new: true }
  );

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }

  res.status(200).json({
    message: "Coupon updated successfully",
    coupon,
  });

  try {
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    // 1. لاقي الكوبون
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon" });
    }

    // 2. تحقق من تاريخ الصلاحية
    if (coupon.expires && coupon.expires < Date.now()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // 3. لاقي الكارت بتاع اليوزر
    let cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price priceAfterDiscount imgCover stock slug"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 4. اعمل إعادة حساب للكارت
    recalcCart(cart);

    // 5. طبق الخصم
    const discount = (cart.cartTotalPrice * coupon.discount) / 100;
    cart.cartTotalPrice = cart.cartTotalPrice - discount;

    await cart.save();

    res.status(200).json({
      message: "Coupon applied successfully",
      discount: coupon.discount,
      cart,
    });
  } catch (err) {
    console.log(`Error:- ${err}`);
    next(err);
  }
};

module.exports = {
  addCoupon,
  getAllCoupon,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
