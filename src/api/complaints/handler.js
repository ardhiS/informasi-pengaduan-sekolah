const ComplaintsService = require('../../services/postgres/complaints/ComplaintsService');

class ComplaintsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postComplaintHandler = this.postComplaintHandler.bind(this);
    this.getComplaintsHandler = this.getComplaintsHandler.bind(this);
    this.getMyComplaintsHandler = this.getMyComplaintsHandler.bind(this);
    this.getAssignedComplaintsHandler =
      this.getAssignedComplaintsHandler.bind(this);
    this.getComplaintByIdHandler = this.getComplaintByIdHandler.bind(this);
    this.putComplaintHandler = this.putComplaintHandler.bind(this);
    this.updateComplaintStatusHandler =
      this.updateComplaintStatusHandler.bind(this);
    this.assignComplaintHandler = this.assignComplaintHandler.bind(this);
    this.deleteComplaintHandler = this.deleteComplaintHandler.bind(this);
    this.getComplaintStatsHandler = this.getComplaintStatsHandler.bind(this);
    this.getAllComplaintsHandler = this.getAllComplaintsHandler.bind(this);
  }
  async postComplaintHandler(request, h) {
    try {
      // Validate payload
      this._validator.validateComplaintPayload(request.payload);

      // Extract user info from JWT token
      const { userId, username, role } = request.auth.credentials;

      // Allow siswa, guru, and admin to create complaints
      if (!['siswa', 'guru', 'admin'].includes(role)) {
        const response = h.response({
          status: 'fail',
          message: 'Anda tidak memiliki akses untuk membuat pengaduan',
        });
        response.code(403);
        return response;
      }

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

      // Add user info to complaint data
      const complaintData = {
        title,
        description,
        category,
        reporter_name: reporter_name || username, // Use username if no name provided
        reporter_email,
        reporter_phone,
        reporter_type: reporter_type || role, // Use role if no type provided
        reporter_class,
        priority: priority || 'medium', // Default priority
      };

      const complaintId = await this._service.addComplaint(complaintData);

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
      // Validate query parameters
      this._validator.validateComplaintQuery(request.query);

      // Extract user info from JWT token
      const { userId, username, role } = request.auth.credentials;

      // Allow siswa, guru, and admin to view all complaints
      if (!['siswa', 'guru', 'admin'].includes(role)) {
        const response = h.response({
          status: 'fail',
          message: 'Anda tidak memiliki akses untuk melihat pengaduan',
        });
        response.code(403);
        return response;
      }

      const { status, category, priority, limit, offset } = request.query;

      // Get complaints based on role
      let complaints;
      if (role === 'admin') {
        // Admin can see all complaints
        complaints = await this._service.getComplaints({
          status,
          category,
          priority,
          limit: limit ? parseInt(limit) : undefined,
          offset: offset ? parseInt(offset) : undefined,
        });
      } else {
        // Siswa and Guru can see all complaints (as per your requirement)
        complaints = await this._service.getComplaints({
          status,
          category,
          priority,
          limit: limit ? parseInt(limit) : undefined,
          offset: offset ? parseInt(offset) : undefined,
        });
      }

      return h.response({
        status: 'success',
        data: {
          complaints,
          user_info: {
            role,
            username,
            can_create: true,
            can_view_all: true,
            can_delete: role === 'admin',
            can_update: ['guru', 'admin'].includes(role),
          },
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
      // Extract user info from JWT token
      const { userId, username, role } = request.auth.credentials;

      // Allow siswa, guru, and admin to view individual complaints
      if (!['siswa', 'guru', 'admin'].includes(role)) {
        const response = h.response({
          status: 'fail',
          message: 'Anda tidak memiliki akses untuk melihat pengaduan',
        });
        response.code(403);
        return response;
      }

      const { id } = request.params;
      const complaint = await this._service.getComplaintById(id);

      return h.response({
        status: 'success',
        data: {
          complaint,
          user_info: {
            role,
            username,
            can_update: ['guru', 'admin'].includes(role),
            can_delete: role === 'admin',
          },
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
      // Validate payload
      this._validator.validateComplaintUpdate(request.payload);

      // Extract user info from JWT token
      const { userId, username, role } = request.auth.credentials;

      // Only guru and admin can update complaints
      if (!['guru', 'admin'].includes(role)) {
        const response = h.response({
          status: 'fail',
          message: 'Anda tidak memiliki akses untuk mengupdate pengaduan',
        });
        response.code(403);
        return response;
      }

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

      // Prepare update data based on role
      let updateData = {
        title,
        description,
        category,
        status,
        priority,
        updated_by: userId,
        updated_by_role: role,
        updated_at: new Date().toISOString(),
      };

      // Only admin can update admin_notes and assigned_to
      if (role === 'admin') {
        updateData.assigned_to = assigned_to;
        updateData.admin_notes = admin_notes;
      }

      // Both guru and admin can add resolution
      if (resolution) {
        updateData.resolution = resolution;
        updateData.resolved_by = userId;
        updateData.resolved_by_role = role;
        updateData.resolved_at = new Date().toISOString();
      }

      await this._service.updateComplaint(id, updateData);

      return h.response({
        status: 'success',
        message: 'Pengaduan berhasil diperbarui',
        data: {
          updated_by: username,
          updated_by_role: role,
        },
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
      // Extract user info from JWT token
      const { userId, username, role } = request.auth.credentials;

      // Only admin can delete complaints
      if (role !== 'admin') {
        const response = h.response({
          status: 'fail',
          message:
            'Anda tidak memiliki akses untuk menghapus pengaduan. Hanya admin yang dapat menghapus pengaduan.',
        });
        response.code(403);
        return response;
      }

      const { id } = request.params;

      // Log the deletion for audit purposes
      console.log(
        `Admin ${username} (ID: ${userId}) is deleting complaint ${id}`
      );

      await this._service.deleteComplaint(id);

      return h.response({
        status: 'success',
        message: 'Pengaduan berhasil dihapus',
        data: {
          deleted_by: username,
          deleted_by_role: role,
          deleted_at: new Date().toISOString(),
        },
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
      // Extract user info from JWT token
      const { userId, username, role } = request.auth.credentials;

      // Allow siswa, guru, and admin to view stats
      if (!['siswa', 'guru', 'admin'].includes(role)) {
        const response = h.response({
          status: 'fail',
          message:
            'Anda tidak memiliki akses untuk melihat statistik pengaduan',
        });
        response.code(403);
        return response;
      }

      const stats = await this._service.getComplaintStats();

      // Add role-based info to stats
      const roleBasedStats = {
        ...stats,
        user_permissions: {
          role,
          can_create: true,
          can_view_all: true,
          can_update: ['guru', 'admin'].includes(role),
          can_delete: role === 'admin',
          can_assign: role === 'admin',
        },
      };

      return h.response({
        status: 'success',
        data: {
          stats: roleBasedStats,
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

  // Get complaints created by current user
  async getMyComplaintsHandler(request, h) {
    try {
      const { userId, username, role } = request.auth.credentials;

      if (!['siswa', 'guru', 'admin'].includes(role)) {
        const response = h.response({
          status: 'fail',
          message: 'Anda tidak memiliki akses untuk melihat pengaduan',
        });
        response.code(403);
        return response;
      }

      const { status, category, priority, limit, offset } = request.query;

      const complaints = await this._service.getComplaintsByUser(userId, {
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
          user_info: {
            role,
            username,
            total_my_complaints: complaints.length,
          },
        },
      });
    } catch (error) {
      console.error('Error in getMyComplaintsHandler:', error);
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  // Get complaints assigned to current user (for guru/admin)
  async getAssignedComplaintsHandler(request, h) {
    try {
      const { userId, username, role } = request.auth.credentials;

      if (!['guru', 'admin'].includes(role)) {
        const response = h.response({
          status: 'fail',
          message:
            'Anda tidak memiliki akses untuk melihat pengaduan yang ditugaskan',
        });
        response.code(403);
        return response;
      }

      const { status, category, priority, limit, offset } = request.query;

      const complaints = await this._service.getAssignedComplaints(userId, {
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
          user_info: {
            role,
            username,
            total_assigned: complaints.length,
          },
        },
      });
    } catch (error) {
      console.error('Error in getAssignedComplaintsHandler:', error);
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      return response;
    }
  }

  // Update only complaint status (guru/admin)
  async updateComplaintStatusHandler(request, h) {
    try {
      // Validate payload
      this._validator.validateComplaintStatus(request.payload);

      const { userId, username, role } = request.auth.credentials;

      if (!['guru', 'admin'].includes(role)) {
        const response = h.response({
          status: 'fail',
          message:
            'Anda tidak memiliki akses untuk mengupdate status pengaduan',
        });
        response.code(403);
        return response;
      }

      const { id } = request.params;
      const { status, resolution } = request.payload;

      const updateData = {
        status,
        updated_by: userId,
        updated_by_role: role,
        updated_at: new Date().toISOString(),
      };

      if (resolution) {
        updateData.resolution = resolution;
        updateData.resolved_by = userId;
        updateData.resolved_by_role = role;
        updateData.resolved_at = new Date().toISOString();
      }

      await this._service.updateComplaintStatus(id, updateData);

      return h.response({
        status: 'success',
        message: 'Status pengaduan berhasil diperbarui',
        data: {
          updated_by: username,
          updated_by_role: role,
          new_status: status,
        },
      });
    } catch (error) {
      console.error('Error in updateComplaintStatusHandler:', error);
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

  // Assign complaint to user (admin only)
  async assignComplaintHandler(request, h) {
    try {
      // Validate payload
      this._validator.validateComplaintAssign(request.payload);

      const { userId, username, role } = request.auth.credentials;

      if (role !== 'admin') {
        const response = h.response({
          status: 'fail',
          message: 'Hanya admin yang dapat menugaskan pengaduan',
        });
        response.code(403);
        return response;
      }

      const { id } = request.params;
      const { assigned_to, admin_notes } = request.payload;

      const updateData = {
        assigned_to,
        admin_notes,
        assigned_by: userId,
        assigned_at: new Date().toISOString(),
        status: 'in_progress',
      };

      await this._service.assignComplaint(id, updateData);

      return h.response({
        status: 'success',
        message: 'Pengaduan berhasil ditugaskan',
        data: {
          assigned_by: username,
          assigned_to,
          admin_notes,
        },
      });
    } catch (error) {
      console.error('Error in assignComplaintHandler:', error);
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

  // Public endpoint to get all complaints for dashboard/sample data generator
  async getAllComplaintsHandler(request, h) {
    try {
      // Get all complaints without authentication (for dashboard stats)
      const complaints = await this._service.getComplaints({});

      return h.response({
        status: 'success',
        data: {
          complaints,
          total: complaints.length,
        },
        complaints, // Also include at root level for compatibility
      });
    } catch (error) {
      console.error('Error in getAllComplaintsHandler:', error);
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
        data: {
          complaints: [],
          total: 0,
        },
        complaints: [], // Return empty array on error
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = ComplaintsHandler;
