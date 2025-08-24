const Brand = require("./../models/brand.model");
const Category = require("./../models/category.model");
const slugify = require("slugify");

const addBrand = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res
        .status(400)
        .json({ success: false, message: "Brand name is Required" });
    }
    req.body.slug = slugify(req.body.name, { lower: true });
    // check if category exists (relation)
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Parent Category Not Found" });
    }
    // check if Brand exists
    const existBrand = await Brand.findOne({ slug: req.body.slug });
    if (existBrand) {
      return res
        .status(400)
        .json({ success: false, message: "Brand already Exists" });
    }
    if (req.file) {
      req.body.logo = req.file.filename;
    }

    const brand = new Brand({
      ...req.body,
      createdBy: req.user?._id,
    });

    await brand.save();
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getAllBrands = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;
    const brand = await Brand.find()
      .populate("category", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sort);

    const total = await Brand.countDocuments();

    if (brand.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Brand found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message:
        brand.length === 0 ? "No brands found" : "Brands fetched successfully",
      data: {
        brand,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getSingleBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Brand fetched successfully",
      data: brand,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true });
    }
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found",
        });
      }
    }
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
    if (req.file) {
      req.body.logo = req.file.filename;
    }
    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      data: brand,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

module.exports = {
  addBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
