const Joi = require('joi');

const GuruPayloadSchema = Joi.object({
  nama: Joi.string().required(),
  nip: Joi.string().required(),
  mapel: Joi.string().required(),
});

const validateGuruPayload = (payload) => {
  const validationResult = GuruPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new Error(validationResult.error.message);
  }
};

module.exports = { validateGuruPayload };
