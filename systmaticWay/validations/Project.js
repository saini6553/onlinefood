const Joi = require('joi');

module.exports = {
  save: Joi.object({
    name: Joi.string().empty(),
    referrer: Joi.string().required(),
    status: Joi.string().required(),
    wearer: Joi.object({
      name: Joi.string().empty(''),
      email: Joi.string().empty('')
    }).unknown(true)
  }).unknown(true),

  update: Joi.object({
    action: Joi.string().required(),
    name: Joi.string(),
    session: Joi.object().unknown(true),
    maker: Joi.object({
      name: Joi.string(),
      email: Joi.string().empty('')
    }).unknown(true),
    wearer: Joi.object({
      name: Joi.string(),
      email: Joi.string().empty('')
    }).unknown(true),
    referrer: Joi.string(),
    media: Joi.array().items(
      Joi.object().keys({
        type: Joi.string().empty(''),
        url: Joi.string().uri({
          scheme: ['http', 'https', 'mqtt', 'mqtts', 'tcp', 'tls', 'ws', 'wss']
        }).empty()
      })),
    metadata: Joi.object().unknown(true),
    price: Joi.object({
      netPrice: Joi.string(),
      discountPercentage: Joi.string(),
      serviceFee: Joi.string(),
      total: Joi.string(),
      status: Joi.string().valid('paid', 'pending', 'fail')
    }).unknown(true),
    state: Joi.string().empty(''),
    status: Joi.string()
  })
};
