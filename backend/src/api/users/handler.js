const ClientError = require('../../exceptions/ClientError');

const usersHandler = {
  // Get users with role filtering
  getUsersHandler: async (request, h) => {
    try {
      const { usersService } = request.server.app;
      const { role, page = 1, limit = 10 } = request.query;
      const users = await usersService.getUsers({ role, page, limit });

      return {
        status: 'success',
        data: { users },
      };
    } catch (error) {
      if (error instanceof ClientError) {
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
      console.error(error);
      return response;
    }
  },

  // Create user (any role)
  addUserHandler: async (request, h) => {
    try {
      const { usersService, validator } = request.server.app;
      validator.validateUserPayload(request.payload);

      const userData = request.payload;
      const userId = await usersService.addUser(userData);

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: { userId },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
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
      console.error(error);
      return response;
    }
  },

  // Get single user
  getUserByIdHandler: async (request, h) => {
    try {
      const { usersService } = request.server.app;
      const { id } = request.params;
      const user = await usersService.getUserById(id);

      return {
        status: 'success',
        data: { user },
      };
    } catch (error) {
      if (error instanceof ClientError) {
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
      console.error(error);
      return response;
    }
  },

  // Update user
  putUserHandler: async (request, h) => {
    try {
      const { usersService, validator } = request.server.app;
      validator.validateUserPayload(request.payload);

      const { id } = request.params;
      const userData = request.payload;
      await usersService.editUser(id, userData);

      return {
        status: 'success',
        message: 'User updated successfully',
      };
    } catch (error) {
      if (error instanceof ClientError) {
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
      console.error(error);
      return response;
    }
  },

  // Delete user
  deleteUserHandler: async (request, h) => {
    try {
      const { usersService } = request.server.app;
      const { id } = request.params;
      await usersService.deleteUser(id);

      return {
        status: 'success',
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error instanceof ClientError) {
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
      console.error(error);
      return response;
    }
  },

  // Get user statistics
  getUserStatsHandler: async (request, h) => {
    try {
      const { usersService } = request.server.app;
      const stats = await usersService.getUserStats();

      return {
        status: 'success',
        data: stats,
      };
    } catch (error) {
      if (error instanceof ClientError) {
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
      console.error(error);
      return response;
    }
  },

  // Legacy compatibility handlers for guru
  getGuruHandler: async (request, h) => {
    request.query.role = 'guru';
    return usersHandler.getUsersHandler(request, h);
  },

  addGuruHandler: async (request, h) => {
    request.payload.role = 'guru';
    return usersHandler.addUserHandler(request, h);
  },

  // Legacy compatibility handlers for siswa
  getSiswaHandler: async (request, h) => {
    request.query.role = 'siswa';
    return usersHandler.getUsersHandler(request, h);
  },

  addSiswaHandler: async (request, h) => {
    request.payload.role = 'siswa';
    return usersHandler.addUserHandler(request, h);
  },
};

module.exports = usersHandler;
