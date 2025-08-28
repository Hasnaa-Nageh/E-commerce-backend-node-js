const Joi = require("joi");

const createSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  category: Joi.string().required(),
  // مش محتاج تتحقق من imageSub هنا، multer هيتكفل
});

const updateSubCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  category: Joi.string().optional(),
  // برضه هنا مش محتاج
});

module.exports = {
  createSubCategorySchema,
  updateSubCategorySchema,
};
