const InvariantError = require('../../exceptions/InvariantError');
const {
  RegisterPayloadSchema,
  LoginPayloadSchema,
  RefreshTokenPayloadSchema,
} = require('./schema');

const AuthValidator = {
  validateRegisterPayload: (payload) => {
    const validationResult = RegisterPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateLoginPayload: (payload) => {
    const validationResult = LoginPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateRefreshTokenPayload: (payload) => {
    const validationResult = RefreshTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthValidator;
