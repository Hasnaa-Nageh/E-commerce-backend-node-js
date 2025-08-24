const Cart = require("../models/cart.model");
const Product = require("../models/products.model");

// Recalculate cart totals
function recalcCart(cart) {
  let total = 0;
  cart.items.forEach((it) => {
    it.totalItemPrice = it.quantity * it.price;
    total += it.totalItemPrice;
  });
  cart.cartTotalPrice = total;
  return cart;
}

// Add item to cart
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId).select(
      "price priceAfterDiscount stock"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    const addQty = Math.max(1, Number(quantity) || 1);
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        cartTotalPrice: 0,
      });
    }

    const idx = cart.items.findIndex((it) => it.product.toString() === productId);
    const effectivePrice =
      typeof product.priceAfterDiscount === "number"
        ? product.priceAfterDiscount
        : product.price;

    if (idx > -1) {
      // Already in cart -> increase quantity
      const newQty = cart.items[idx].quantity + addQty;

      if (product.stock != null && newQty > product.stock) {
        return res.status(400).json({ message: "Requested quantity exceeds stock" });
      }

      cart.items[idx].quantity = newQty;
      cart.items[idx].price = effectivePrice;
    } else {
      // Not in cart -> add new item
      if (product.stock != null && addQty > product.stock) {
        return res.status(400).json({ message: "Requested quantity exceeds stock" });
      }

      cart.items.push({
        product: productId,
        quantity: addQty,
        price: effectivePrice,
        totalItemPrice: 0,
      });
    }

    recalcCart(cart);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "title price priceAfterDiscount imgCover stock slug"
    );

    res.status(201).json({
      message: "Item added to cart",
      cart: populated,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

// Get all items in cart
const getAllCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price priceAfterDiscount imgCover stock slug"
    );

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: { items: [], cartTotalPrice: 0 },
      });
    }

    recalcCart(cart);
    await cart.save();

    res.status(200).json({ cart });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

// Update item quantity
const updateItemQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity == null) {
      return res.status(400).json({ message: "quantity is required" });
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty)) {
      return res.status(400).json({ message: "quantity must be a number" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex((it) => it.product.toString() === productId);
    if (idx === -1) return res.status(404).json({ message: "Item not in cart" });

    if (qty <= 0) {
      cart.items.splice(idx, 1);
    } else {
      const product = await Product.findById(productId).select("stock");
      if (!product) return res.status(404).json({ message: "Product not found" });

      if (product.stock != null && qty > product.stock) {
        return res.status(400).json({ message: "Requested quantity exceeds stock" });
      }

      cart.items[idx].quantity = qty;
    }

    recalcCart(cart);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "title price priceAfterDiscount imgCover stock slug"
    );

    res.status(200).json({
      message: "Quantity updated",
      cart: populated,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

// Remove single item
const removeItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const before = cart.items.length;
    cart.items = cart.items.filter((it) => it.product.toString() !== productId);

    if (cart.items.length === before) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    recalcCart(cart);
    await cart.save();

    const populated = await Cart.findById(cart._id).populate(
      "items.product",
      "title price priceAfterDiscount imgCover stock slug"
    );

    res.status(200).json({
      message: "Item removed",
      cart: populated,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

// Clear cart
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(200).json({
        message: "Cart already empty",
        cart: { items: [], cartTotalPrice: 0 },
      });
    }

    cart.items = [];
    cart.cartTotalPrice = 0;
    await cart.save();

    res.status(200).json({
      message: "Cart cleared",
      cart: { items: [], cartTotalPrice: 0 },
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

module.exports = {
  addToCart,
  getAllCart,
  updateItemQuantity,
  removeItem,
  clearCart,
};
