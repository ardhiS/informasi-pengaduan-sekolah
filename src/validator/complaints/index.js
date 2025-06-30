const InvariantError = require('../../exceptions/InvariantError');
const { ComplaintPayloadSchema, ComplaintStatusSchema } = require('./schema');

const ComplaintsValidator = {
  validateComplaintPayload: (payload) => {
    const validationResult = ComplaintPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateComplaintStatus: (payload) => {
    const validationResult = ComplaintStatusSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ComplaintsValidator;
