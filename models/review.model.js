const mongoose = require("mongoose");

const reviewModel = new mongoose.Schema({
  comment: { type: String },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "products",
    required: true,
  },
  rate: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
});

module.exports = mongoose.model("review", reviewModel);
