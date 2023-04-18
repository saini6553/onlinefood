const Joi = require('joi');

module.exports = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    platform: Joi.string().required()
  }),
  signup: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    userType: Joi.string().required(),
    role: Joi.array().required()
  })
};
