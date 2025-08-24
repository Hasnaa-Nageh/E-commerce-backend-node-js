const Joi = require("joi");

// for Create Product
const createProductSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  slug: Joi.string().optional(),
  description: Joi.string().min(20).max(2000).optional(),
  imgCover: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  price: Joi.number().positive().required(),
  priceAfterDiscount: Joi.number().positive().less(Joi.ref("price")).optional(),
  sold: Joi.number().min(0).optional(),
  stock: Joi.number().min(0).optional(),
  category: Joi.string().length(24).hex().required(),
  subCategory: Joi.string().length(24).hex().optional(),
  brand: Joi.string().length(24).hex().optional(),
  rateAvg: Joi.number().min(0).max(5).optional(),
  rateCount: Joi.number().min(0).optional(),
});

// for Update Product
const updateProductSchema = Joi.object({
  title: Joi.string().min(2).max(100).optional(),
  slug: Joi.string().optional(),
  description: Joi.string().min(20).max(2000).optional(),
  imgCover: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  price: Joi.number().positive().optional(),
  priceAfterDiscount: Joi.number().positive().less(Joi.ref("price")).optional(),
  sold: Joi.number().min(0).optional(),
  stock: Joi.number().min(0).optional(),
  category: Joi.string().length(24).hex().optional(),
  subCategory: Joi.string().length(24).hex().optional(),
  brand: Joi.string().length(24).hex().optional(),
  rateAvg: Joi.number().min(0).max(5).optional(),
  rateCount: Joi.number().min(0).optional(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
