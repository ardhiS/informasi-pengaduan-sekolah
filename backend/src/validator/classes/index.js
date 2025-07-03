const InvariantError = require('../../exceptions/InvariantError');
const {
  ClassPayloadSchema,
  ClassStudentPayloadSchema,
  ClassCollaboratorPayloadSchema,
} = require('./schema');

const ClassesValidator = {
  validateClassPayload: (payload) => {
    const validationResult = ClassPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateClassStudentPayload: (payload) => {
    const validationResult = ClassStudentPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateClassCollaboratorPayload: (payload) => {
    const validationResult = ClassCollaboratorPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ClassesValidator;
