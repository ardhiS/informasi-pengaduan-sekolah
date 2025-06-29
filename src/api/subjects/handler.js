class SubjectsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSubjectHandler = this.postSubjectHandler.bind(this);
    this.getSubjectsHandler = this.getSubjectsHandler.bind(this);
    this.getSubjectByIdHandler = this.getSubjectByIdHandler.bind(this);
    this.putSubjectByIdHandler = this.putSubjectByIdHandler.bind(this);
    this.deleteSubjectByIdHandler = this.deleteSubjectByIdHandler.bind(this);
  }

  async postSubjectHandler(request, h) {
    this._validator.validateSubjectPayload(request.payload);
    const { name, code, description } = request.payload;

    const subjectId = await this._service.addSubject({
      name,
      code,
      description,
    });

    const response = h.response({
      status: 'success',
      message: 'Mata pelajaran berhasil ditambahkan',
      data: {
        subjectId,
      },
    });
    response.code(201);
    return response;
  }

  async getSubjectsHandler() {
    const subjects = await this._service.getSubjects();
    return {
      status: 'success',
      data: {
        subjects,
      },
    };
  }

  async getSubjectByIdHandler(request) {
    const { id } = request.params;
    const subject = await this._service.getSubjectById(id);
    return {
      status: 'success',
      data: {
        subject,
      },
    };
  }

  async putSubjectByIdHandler(request) {
    this._validator.validateSubjectPayload(request.payload);
    const { name, code, description } = request.payload;
    const { id } = request.params;

    await this._service.editSubjectById(id, { name, code, description });

    return {
      status: 'success',
      message: 'Mata pelajaran berhasil diperbarui',
    };
  }

  async deleteSubjectByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSubjectById(id);

    return {
      status: 'success',
      message: 'Mata pelajaran berhasil dihapus',
    };
  }
}

module.exports = SubjectsHandler;
