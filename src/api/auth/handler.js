class AuthHandler {
  constructor(service, validator, refreshTokenService = null) {
    this._service = service;
    this._validator = validator;
    this._refreshTokenService = refreshTokenService;

    this.postRegisterHandler = this.postRegisterHandler.bind(this);
    this.postLoginHandler = this.postLoginHandler.bind(this);
    this.getProfileHandler = this.getProfileHandler.bind(this);
    this.postLogoutHandler = this.postLogoutHandler.bind(this);
  }

  async postRegisterHandler(request, h) {
    this._validator.validateRegisterPayload(request.payload);
    const { username, password, fullname, role } = request.payload;

    const userId = await this._service.register({
      username,
      password,
      fullname,
      role,
    });

    const response = h.response({
      status: 'success',
      message: 'User berhasil didaftarkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async postLoginHandler(request, h) {
    this._validator.validateLoginPayload(request.payload);
    const { username, password } = request.payload;

    const { token, user } = await this._service.login({ username, password });

    // Menggunakan user.id dari login response
    const accessToken = this._service.generateAccessToken({ userId: user.id });
    const refreshToken = this._service.generateRefreshToken({
      userId: user.id,
    });

    // Jika ada RefreshTokenService, simpan refresh token
    if (this._refreshTokenService) {
      await this._refreshTokenService.addRefreshToken(user.id, refreshToken);
    }

    const response = h.response({
      status: 'success',
      message: 'Login berhasil',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(200);
    return response;
  }

  async getProfileHandler(request, h) {
    const { userId } = request.auth.credentials;
    const user = await this._service.getUserById(userId);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async postLogoutHandler(request, h) {
    // Jika ada refresh token di payload, hapus dari database
    if (
      request.payload &&
      request.payload.refreshToken &&
      this._refreshTokenService
    ) {
      try {
        await this._refreshTokenService.verifyRefreshToken(
          request.payload.refreshToken
        );
        await this._refreshTokenService.deleteRefreshToken(
          request.payload.refreshToken
        );
      } catch (error) {
        // Jika token tidak valid, tetap lanjutkan logout
      }
    }

    return {
      status: 'success',
      message: 'Logout berhasil',
    };
  }
}

module.exports = AuthHandler;
