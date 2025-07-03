const InvariantError = require('../../exceptions/InvariantError');
const { SubjectPayloadSchema } = require('./schema');

const SubjectsValidator = {
  validateSubjectPayload: (payload) => {
    const validationResult = SubjectPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SubjectsValidator;
