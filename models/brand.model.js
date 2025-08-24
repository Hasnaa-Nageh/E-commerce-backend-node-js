const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Brand name is required"],
      minLength: [2, "Too short brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    logo: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("brand", brandSchema);
