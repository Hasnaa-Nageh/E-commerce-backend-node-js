const mongoose = require("mongoose");
const slugify = require("slugify"); // ✅ لازم نستوردها

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minLength: [2, "too short subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    imageSub: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

subCategorySchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model("subCategory", subCategorySchema);
