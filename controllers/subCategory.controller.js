const Category = require("../models/category.model");
const SubCategory = require("./../models/subCategory.model");
const slugify = require("slugify");

const addSubCategory = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res
        .status(400)
        .json({ success: false, message: "SubCategory name us Required" });
    }
    req.body.slug = slugify(req.body.name, { lower: true });

    // check if category exists (relation)
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Parent category not found",
      });
    }
    // check if subCategory exists

    const existingSubCategory = await SubCategory.findOne({
      slug: req.body.slug,
    });
    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: "SubCategory already exists",
      });
    }
    if (req.file) {
      req.body.imageSub = req.file.path || req.file.secure_url;
    }

    const subCategory = new SubCategory(req.body);
    await subCategory.save();

    return res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      data: subCategory,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

const getAllSubCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    let filterObj = {};
    if (req.params.id) filterObj.category = req.params.id;
    const subCategories = await SubCategory.find(filterObj)
      .populate("category", "name")
      .skip((page - 1) * limit)
      .sort(sort);
    const total = await SubCategory.countDocuments();

    if (subCategories.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No subCategories found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategories fetched successfully",
      data: {
        subCategories,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("Error in addSubCategory:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
      error: err,
    });
  }
};

const getSingleSubCategory = async (req, res, next) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "category",
      "name"
    );
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory fetched successfully",
      data: subCategory,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
  }
};

const UpdateSubCategory = async (req, res, next) => {
  try {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name, { lower: true });
    }
    if (req.file) {
      req.body.imageSub = req.file.path;
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

    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory updated successfully",
      data: subCategory,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SubCategory deleted successfully",
      data: subCategory,
    });
  } catch (err) {
    console.log(`Error :- ${err}`);
    next(err);
  }
};

module.exports = {
  addSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  UpdateSubCategory,
  deleteSubCategory,
};
