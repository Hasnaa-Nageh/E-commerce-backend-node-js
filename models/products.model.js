const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short products name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 20,
      maxLength: 2000,
    },
    imgCover: {
      type: String,
    },
    images: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      min: 0,
      required:true
    },
    sold: {
      type: Number,
    },
    stock: {
      type: Number,
      min: 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    subCategory: {
      type: mongoose.Types.ObjectId,
      ref: "subCategory",
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "brand",
    },
    rateAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    rateCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("products", productsSchema);
