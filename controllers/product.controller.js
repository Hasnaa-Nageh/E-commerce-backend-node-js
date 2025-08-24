const Product = require("./../models/products.model");
const Brand = require("./../models/brand.model");
const SubCategory = require("./../models/subCategory.model");
const Category = require("./../models/category.model");
const slugify = require("slugify");

const addProduct = async (req, res, next) => {
  try {
    const { title, category, subCategory, brand, price, priceAfterDiscount } =
      req.body;

    if (!title || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, Category, and Price are required",
      });
    }

    req.body.slug = slugify(title, { lower: true });

    // check Category Exists
    const existCategory = await Category.findById(category);
    if (!existCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }

    // check Brand Exists
    const existBrand = await Brand.findById(brand);
    if (!existBrand) {
      return res
        .status(400)
        .json({ success: false, message: "Brand not found" });
    }

    // check SubCategory Exists
    const existSubCategory = await SubCategory.findById(subCategory);
    if (!existSubCategory) {
      return res
        .status(400)
        .json({ success: false, message: "SubCategory not found" });
    }

    // check discount < price
    if (priceAfterDiscount && priceAfterDiscount >= price) {
      return res.status(400).json({
        success: false,
        message: "Discounted price must be less than price",
      });
    }

    if (req.files?.imgCover) {
      req.body.imgCover = req.files.imgCover[0].filename;
    }

    if (req.files?.images) {
      req.body.images = req.files.images.map((file) => file.filename);
    }

    // Save Product
    const product = new Product({
      ...req.body,
      createdBy: req.user?._id,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.error("Error in addProduct:", err.message);
    next(err);
  }
};

const getAllProduct = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const products = await Product.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sort);

    const total = await Product.countDocuments();

    return res.status(200).json({
      success: true,
      message:
        products.length === 0
          ? "No products found"
          : "Products fetched successfully",
      data: {
        products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.log(`Error`);
    next(err);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    console.log(`Error`);
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  if (req.body.title) {
    req.body.slug = slugify(req.body.title, { lower: true });
  }

  if (req.body.category) {
    const existCategory = await Category.findById(req.body.category);
    if (!existCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }
  }

  if (req.body.subCategory) {
    const existSubCategory = await SubCategory.findById(req.body.subCategory);
    if (!existSubCategory) {
      return res
        .status(400)
        .json({ success: false, message: "SubCategory not found" });
    }
  }

  if (req.body.brand) {
    const existBrand = await Brand.findById(req.body.brand);
    if (!existBrand) {
      return res
        .status(400)
        .json({ success: false, message: "Brand not found" });
    }
  }

  if (
    req.body.price &&
    req.body.priceAfterDiscount &&
    req.body.priceAfterDiscount >= req.body.price
  ) {
    return res.status(400).json({
      success: false,
      message: "Discounted price must be less than price",
    });
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (req.files?.imgCover) {
    req.body.imgCover = req.files.imgCover[0].filename;
  }

  if (req.files?.images) {
    req.body.images = req.files.images.map((file) => file.filename);
  }
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });

  try {
  } catch (err) {
    console.log(`Error`);
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (err) {
    console.log(`Error`);
    next(err);
  }
};

module.exports = {
  addProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
