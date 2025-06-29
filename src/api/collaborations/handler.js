class CollaborationsHandler {
  constructor(collaborationsService, classesService, validator) {
    this._collaborationsService = collaborationsService;
    this._classesService = classesService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateClassCollaboratorPayload(request.payload);
    const { classId, userId } = request.payload;
    const { userId: credentialId } = request.auth.credentials;

    await this._classesService.verifyClassOwner(classId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(
      classId,
      userId
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateClassCollaboratorPayload(request.payload);
    const { classId, userId } = request.payload;
    const { userId: credentialId } = request.auth.credentials;

    await this._classesService.verifyClassOwner(classId, credentialId);
    await this._collaborationsService.deleteCollaboration(classId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
