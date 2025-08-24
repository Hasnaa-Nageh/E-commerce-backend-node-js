const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        price: Number,
        totalItemPrice: Number,
      },
    ],
    cartTotalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
