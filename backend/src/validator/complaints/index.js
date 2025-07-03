const InvariantError = require('../../exceptions/InvariantError');
const {
  ComplaintPayloadSchema,
  ComplaintUpdateSchema,
  ComplaintStatusSchema,
  ComplaintAssignSchema,
  ComplaintQuerySchema,
} = require('./schema');

const ComplaintsValidator = {
  validateComplaintPayload: (payload) => {
    const validationResult = ComplaintPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateComplaintUpdate: (payload) => {
    const validationResult = ComplaintUpdateSchema.validate(payload);
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

  validateComplaintAssign: (payload) => {
    const validationResult = ComplaintAssignSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateComplaintQuery: (query) => {
    const validationResult = ComplaintQuerySchema.validate(query);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ComplaintsValidator;
