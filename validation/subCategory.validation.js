const Joi = require("joi");

const createSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  category: Joi.string().required(), 
});

const updateSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  category: Joi.string().optional(),
});

module.exports = {
  createSubCategorySchema,
  updateSubCategorySchema,
};
