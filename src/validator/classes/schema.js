const Joi = require('joi');

const ClassPayloadSchema = Joi.object({
  name: Joi.string().required(),
  subjectId: Joi.string().required(),
  description: Joi.string().allow(''),
});

const ClassStudentPayloadSchema = Joi.object({
  studentId: Joi.string().required(),
});

const ClassCollaboratorPayloadSchema = Joi.object({
  userId: Joi.string().required(),
});

module.exports = {
  ClassPayloadSchema,
  ClassStudentPayloadSchema,
  ClassCollaboratorPayloadSchema,
};
