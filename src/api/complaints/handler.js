const ComplaintsService = require('../../services/postgres/complaints/ComplaintsService');

class ComplaintsHandler {
  constructor() {
    this._service = new ComplaintsService();

    this.postComplaintHandler = this.postComplaintHandler.bind(this);
    this.getComplaintsHandler = this.getComplaintsHandler.bind(this);
    this.getComplaintByIdHandler = this.getComplaintByIdHandler.bind(this);
    this.putComplaintHandler = this.putComplaintHandler.bind(this);
    this.deleteComplaintHandler = this.deleteComplaintHandler.bind(this);
    this.getComplaintStatsHandler = this.getComplaintStatsHandler.bind(this);
  }

  async postComplaintHandler(request, h) {
    try {
      const {
        title,
        description,
        category,
        reporter_name,
        reporter_email,
        reporter_phone,
        reporter_type,
        reporter_class,
        priority,
      } = request.payload;

      const complaintId = await this._service.addComplaint({
        title,
        description,
        category,
        reporter_name,
        reporter_email,
        reporter_phone,
        reporter_type,
        reporter_class,
        priority,
      });

      const response = h.response({
        status: 'success',
        message: 'Pengaduan berhasil ditambahkan',
        data: {
          complaintId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error('Error in postComplaintHandler:', error);
      if (error.statusCode) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async getComplaintsHandler(request, h) {
    try {
      const { status, category, priority, limit, offset } = request.query;

      const complaints = await this._service.getComplaints({
        status,
        category,
        priority,
        limit: limit ? parseInt(limit) : undefined,
        offset: offset ? parseInt(offset) : undefined,
      });

      return h.response({
        status: 'success',
        data: {
          complaints,
        },
      });
    } catch (error) {
      console.error('Error in getComplaintsHandler:', error);
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async getComplaintByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const complaint = await this._service.getComplaintById(id);

      return h.response({
        status: 'success',
        data: {
          complaint,
        },
      });
    } catch (error) {
      console.error('Error in getComplaintByIdHandler:', error);
      if (error.statusCode) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async putComplaintHandler(request, h) {
    try {
      const { id } = request.params;
      const {
        title,
        description,
        category,
        status,
        priority,
        assigned_to,
        admin_notes,
        resolution,
      } = request.payload;

      await this._service.updateComplaint(id, {
        title,
        description,
        category,
        status,
        priority,
        assigned_to,
        admin_notes,
        resolution,
      });

      return h.response({
        status: 'success',
        message: 'Pengaduan berhasil diperbarui',
      });
    } catch (error) {
      console.error('Error in putComplaintHandler:', error);
      if (error.statusCode) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async deleteComplaintHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteComplaint(id);

      return h.response({
        status: 'success',
        message: 'Pengaduan berhasil dihapus',
      });
    } catch (error) {
      console.error('Error in deleteComplaintHandler:', error);
      if (error.statusCode) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  async getComplaintStatsHandler(request, h) {
    try {
      const stats = await this._service.getComplaintStats();

      return h.response({
        status: 'success',
        data: {
          stats,
        },
      });
    } catch (error) {
      console.error('Error in getComplaintStatsHandler:', error);
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = ComplaintsHandler;
