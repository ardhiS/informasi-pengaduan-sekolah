const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

const authHandler = {
  // Login (from authentications)
  loginHandler: async (request, h) => {
    try {
      const { validator, authService, usersService } = request.server.app;
      validator.validateLoginPayload(request.payload);

      const { username, password } = request.payload;
      const { userId, role } = await authService.verifyUserCredential(
        username,
        password
      );

      const accessToken = authService.generateAccessToken({
        userId,
        role,
      });
      const refreshToken = authService.generateRefreshToken({
        userId,
        role,
      });

      await authService.addRefreshToken(refreshToken, userId);

      const response = h.response({
        status: 'success',
        message: 'Login berhasil',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: userId,
            username,
            role,
          },
        },
      });
      response.code(200);
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

  // Register (from auth)
  registerHandler: async (request, h) => {
    try {
      const { validator, usersService } = request.server.app;
      validator.validateRegisterPayload(request.payload);

      const { username, password, fullname, role } = request.payload;
      const userId = await usersService.addUser({
        username,
        password,
        fullName: fullname,
        role,
      });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
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

  // Logout (from authentications)
  logoutHandler: async (request, h) => {
    try {
      const { validator, authService } = request.server.app;
      validator.validateRefreshTokenPayload(request.payload);

      const { refreshToken } = request.payload;
      await authService.verifyRefreshToken(refreshToken);
      await authService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Logout berhasil',
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

  // Refresh Token (from authentications)
  refreshHandler: async (request, h) => {
    try {
      const { validator, authService } = request.server.app;
      validator.validateRefreshTokenPayload(request.payload);

      const { refreshToken } = request.payload;
      await authService.verifyRefreshToken(refreshToken);

      const { userId, role } =
        authService.verifyRefreshTokenSignature(refreshToken);
      const accessToken = authService.generateAccessToken({
        userId,
        role,
      });

      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
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

  // Get Profile
  getProfileHandler: async (request, h) => {
    try {
      const { usersService } = request.server.app;
      const { userId } = request.auth.credentials;
      const user = await usersService.getUserById(userId);

      return {
        status: 'success',
        data: {
          user,
        },
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
};

module.exports = authHandler;
