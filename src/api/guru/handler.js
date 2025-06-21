class GuruHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postGuruHandler = this.postGuruHandler.bind(this);
    this.getGuruByIdHandler = this.getGuruByIdHandler.bind(this);
    this.getAllGuruHandler = this.getAllGuruHandler.bind(this);
    this.putGuruByIdHandler = this.putGuruByIdHandler.bind(this);
    this.deleteGuruByIdHandler = this.deleteGuruByIdHandler.bind(this);
  }

  async postGuruHandler(request, h) {
    this._validator.validateGuruPayload(request.payload);
    const { nama, nip, mapel } = request.payload;
    const guruId = await this._service.addGuru({ nama, nip, mapel });
    const response = h.response({
      status: 'success',
      message: 'Guru berhasil ditambahkan',
      data: { guruId },
    });
    response.code(201);
    return response;
  }

  async getGuruByIdHandler(request, h) {
    const { id } = request.params;
    const guru = await this._service.getGuruById(id);
    return {
      status: 'success',
      data: { guru },
    };
  }

  async getAllGuruHandler(request, h) {
    const gurus = await this._service.getAllGuru();
    return {
      status: 'success',
      data: { gurus },
    };
  }

  async putGuruByIdHandler(request, h) {
    this._validator.validateGuruPayload(request.payload);
    const { id } = request.params;
    const { nama, nip, mapel } = request.payload;

    await this._service.editGuruById(id, { nama, nip, mapel });

    return {
      status: 'success',
      message: 'Guru berhasil diperbarui',
    };
  }

  async deleteGuruByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteGuruById(id);

    return {
      status: 'success',
      message: 'Guru berhasil dihapus',
    };
  }
}

module.exports = GuruHandler;
