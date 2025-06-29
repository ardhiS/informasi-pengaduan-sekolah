const Joi = require('joi');

const RegisterPayloadSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().max(100).required(),
  role: Joi.string().valid('admin', 'guru', 'siswa', 'user').default('user'),
});

const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { RegisterPayloadSchema, LoginPayloadSchema };
