const Joi = require('joi');

const ComplaintPayloadSchema = Joi.object({
  title: Joi.string().required().min(3).max(200),
  description: Joi.string().required().min(10).max(2000),
  category: Joi.string()
    .valid('akademik', 'fasilitas', 'bullying', 'lainnya')
    .default('lainnya'),
  priority: Joi.string()
    .valid('low', 'medium', 'high', 'urgent')
    .default('medium'),
  reporter_name: Joi.string().allow('').max(100),
  reporter_email: Joi.string().email().allow('').max(100),
  reporter_phone: Joi.string().allow('').max(20),
  reporter_type: Joi.string().valid('siswa', 'guru', 'admin').allow(''),
  reporter_class: Joi.string().allow('').max(20),
});

const ComplaintUpdateSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().min(10).max(2000),
  category: Joi.string().valid('akademik', 'fasilitas', 'bullying', 'lainnya'),
  status: Joi.string().valid('pending', 'in_progress', 'resolved', 'closed'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  assigned_to: Joi.string().allow('').max(50),
  admin_notes: Joi.string().allow('').max(2000),
  resolution: Joi.string().allow('').max(2000),
});

const ComplaintStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'in_progress', 'resolved', 'closed')
    .required(),
  resolution: Joi.string().allow('').max(2000),
});

const ComplaintAssignSchema = Joi.object({
  assigned_to: Joi.string().required().max(50),
  admin_notes: Joi.string().allow('').max(2000),
});

const ComplaintQuerySchema = Joi.object({
  status: Joi.string().valid('pending', 'in_progress', 'resolved', 'closed'),
  category: Joi.string().valid('akademik', 'fasilitas', 'bullying', 'lainnya'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  limit: Joi.number().integer().min(1).max(100),
  offset: Joi.number().integer().min(0),
});

module.exports = {
  ComplaintPayloadSchema,
  ComplaintUpdateSchema,
  ComplaintStatusSchema,
  ComplaintAssignSchema,
  ComplaintQuerySchema,
};
