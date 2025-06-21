const Joi = require('joi');

const SiswaPayloadSchema = Joi.object({
  nama: Joi.string().required(),
  nis: Joi.string().required(),
  kelas: Joi.string().required(),
});

const validateSiswaPayload = (payload) => {
  const validationResult = SiswaPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new Error(validationResult.error.message);
  }
};

module.exports = { validateSiswaPayload };
