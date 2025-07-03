const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  role: Joi.string().valid('admin', 'guru', 'siswa').default('siswa'),
});

module.exports = { UserPayloadSchema };
