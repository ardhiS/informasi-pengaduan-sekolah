class SiswaHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postSiswaHandler = this.postSiswaHandler.bind(this);
    this.getSiswaByIdHandler = this.getSiswaByIdHandler.bind(this);
    this.getAllSiswaHandler = this.getAllSiswaHandler.bind(this);
    this.putSiswaByIdHandler = this.putSiswaByIdHandler.bind(this);
    this.deleteSiswaByIdHandler = this.deleteSiswaByIdHandler.bind(this);
  }

  async postSiswaHandler(request, h) {
    this._validator.validateSiswaPayload(request.payload);
    const { nama, nis, kelas } = request.payload;
    const siswaId = await this._service.addSiswa({ nama, nis, kelas });
    const response = h.response({
      status: 'success',
      message: 'Siswa berhasil ditambahkan',
      data: { siswaId },
    });
    response.code(201);
    return response;
  }

  async getSiswaByIdHandler(request, h) {
    const { id } = request.params;
    const siswa = await this._service.getSiswaById(id);
    return {
      status: 'success',
      data: { siswa },
    };
  }

  async getAllSiswaHandler(request, h) {
    const siswa = await this._service.getAllSiswa();
    return {
      status: 'success',
      data: { siswa },
    };
  }

  async putSiswaByIdHandler(request, h) {
    this._validator.validateSiswaPayload(request.payload);
    const { id } = request.params;
    const { nama, nis, kelas } = request.payload;
    await this._service.editSiswaById(id, { nama, nis, kelas });
    return {
      status: 'success',
      message: 'Siswa berhasil diperbarui',
    };
  }

  async deleteSiswaByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSiswaById(id);
    return {
      status: 'success',
      message: 'Siswa berhasil dihapus',
    };
  }
}

module.exports = SiswaHandler;
