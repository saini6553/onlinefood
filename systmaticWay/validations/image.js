const Joi = require('joi');

module.exports = {
  upload: Joi.object({
    file: Joi.object().required(),
    namespace: Joi.string().required()
  })
};
