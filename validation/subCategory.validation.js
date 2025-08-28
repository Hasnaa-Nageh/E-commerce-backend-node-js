const Joi = require("joi");

const createSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  category: Joi.string().required(),
  imageSub: Joi.any(),
});

const updateSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  category: Joi.string().optional(),
  imageSub: Joi.any(),
});

module.exports = {
  createSubCategorySchema,
  updateSubCategorySchema,
};
