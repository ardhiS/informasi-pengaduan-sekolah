class AuthenticationsHandler {
  constructor(authService, usersService, refreshTokenService, validator) {
    this._authService = authService;
    this._usersService = usersService;
    this._refreshTokenService = refreshTokenService;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const userId = await this._authService.verifyUserCredential(
      username,
      password
    );

    const accessToken = this._authService.generateAccessToken({ userId });
    const refreshToken = this._authService.generateRefreshToken({ userId });

    await this._refreshTokenService.addRefreshToken(userId, refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request) {
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._refreshTokenService.verifyRefreshToken(refreshToken);
    const { userId } = this._authService.verifyRefreshToken(refreshToken);

    const accessToken = this._authService.generateAccessToken({ userId });

    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    this._validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    await this._refreshTokenService.verifyRefreshToken(refreshToken);
    await this._refreshTokenService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
