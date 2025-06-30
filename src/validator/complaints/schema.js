const Joi = require('joi');

const ComplaintPayloadSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().required().min(10).max(2000),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  category: Joi.string()
    .valid('akademik', 'fasilitas', 'layanan', 'lainnya')
    .default('lainnya'),
});

const ComplaintStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in_progress', 'resolved', 'closed')
    .required(),
  admin_response: Joi.string().allow('').max(2000),
});

module.exports = { ComplaintPayloadSchema, ComplaintStatusSchema };
