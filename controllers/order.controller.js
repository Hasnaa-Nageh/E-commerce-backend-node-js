const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

// Create Order
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price priceAfterDiscount"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // create order
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        totalItemPrice: item.totalItemPrice,
      })),
      totalOrderPrice: cart.cartTotalPrice,
    });

    await order.save();

    // clear cart after order
    cart.items = [];
    cart.cartTotalPrice = 0;
    await cart.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

// Get all orders for logged-in user
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product",
      "title imgCover slug"
    );

    res.status(200).json({ orders });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

// Admin: get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.status(200).json({ orders });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

// Admin: update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
