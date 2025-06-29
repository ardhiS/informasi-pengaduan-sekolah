class ClassesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postClassHandler = this.postClassHandler.bind(this);
    this.getClassesHandler = this.getClassesHandler.bind(this);
    this.getClassByIdHandler = this.getClassByIdHandler.bind(this);
    this.putClassByIdHandler = this.putClassByIdHandler.bind(this);
    this.deleteClassByIdHandler = this.deleteClassByIdHandler.bind(this);
    this.postStudentToClassHandler = this.postStudentToClassHandler.bind(this);
    this.getClassStudentsHandler = this.getClassStudentsHandler.bind(this);
    this.deleteStudentFromClassHandler =
      this.deleteStudentFromClassHandler.bind(this);
    this.getClassActivitiesHandler = this.getClassActivitiesHandler.bind(this);
  }

  async postClassHandler(request, h) {
    this._validator.validateClassPayload(request.payload);
    const { name, subjectId, description } = request.payload;
    const { userId } = request.auth.credentials;

    const classId = await this._service.addClass({
      name,
      subjectId,
      teacherId: userId,
      description,
    });

    const response = h.response({
      status: 'success',
      message: 'Kelas berhasil ditambahkan',
      data: {
        classId,
      },
    });
    response.code(201);
    return response;
  }

  async getClassesHandler(request) {
    const { userId } = request.auth.credentials;
    const classes = await this._service.getClasses(userId);

    return {
      status: 'success',
      data: {
        classes,
      },
    };
  }

  async getClassByIdHandler(request) {
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyClassAccess(id, userId);
    const classData = await this._service.getClassById(id);

    return {
      status: 'success',
      data: {
        class: classData,
      },
    };
  }

  async putClassByIdHandler(request) {
    this._validator.validateClassPayload(request.payload);
    const { name, subjectId, description } = request.payload;
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyClassOwner(id, userId);
    await this._service.editClassById(id, { name, subjectId, description });

    return {
      status: 'success',
      message: 'Kelas berhasil diperbarui',
    };
  }

  async deleteClassByIdHandler(request) {
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyClassOwner(id, userId);
    await this._service.deleteClassById(id);

    return {
      status: 'success',
      message: 'Kelas berhasil dihapus',
    };
  }

  async postStudentToClassHandler(request, h) {
    this._validator.validateClassStudentPayload(request.payload);
    const { studentId } = request.payload;
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyClassAccess(id, userId);
    await this._service.addStudentToClass(id, studentId, userId);

    const response = h.response({
      status: 'success',
      message: 'Siswa berhasil ditambahkan ke kelas',
    });
    response.code(201);
    return response;
  }

  async getClassStudentsHandler(request) {
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyClassAccess(id, userId);
    const classData = await this._service.getClassById(id);
    const students = await this._service.getClassStudents(id);

    return {
      status: 'success',
      data: {
        class: {
          id: classData.id,
          name: classData.name,
          teacher_name: classData.teacher_name,
          students,
        },
      },
    };
  }

  async deleteStudentFromClassHandler(request) {
    const { id, studentId } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyClassAccess(id, userId);
    await this._service.removeStudentFromClass(id, studentId, userId);

    return {
      status: 'success',
      message: 'Siswa berhasil dihapus dari kelas',
    };
  }

  async getClassActivitiesHandler(request) {
    const { id } = request.params;
    const { userId } = request.auth.credentials;

    await this._service.verifyClassAccess(id, userId);
    const activities = await this._service.getClassActivities(id);

    return {
      status: 'success',
      data: {
        classId: id,
        activities,
      },
    };
  }
}

module.exports = ClassesHandler;
