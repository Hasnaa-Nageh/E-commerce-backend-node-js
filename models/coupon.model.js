const mongoose = require("mongoose");

const couponModel = new mongoose.Schema({
  code: { type: Number, unique: true, required: true },
  expires: { type: Date },
  discount: {
    type: Number,
  },
});

module.exports = mongoose.model("coupon", couponModel);
 