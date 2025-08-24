const Joi = require("joi");

const createBrandSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  category: Joi.string().required(), 
});

const updateBrandSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  category: Joi.string().optional(),
});

module.exports = {
  createBrandSchema,
  updateBrandSchema,
};
