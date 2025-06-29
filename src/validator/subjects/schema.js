const Joi = require('joi');

const SubjectPayloadSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().allow(''),
});

module.exports = { SubjectPayloadSchema };
