const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (
    server,
    { authService, usersService, refreshTokenService, validator }
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authService,
      usersService,
      refreshTokenService,
      validator
    );
    server.route(routes(authenticationsHandler));
  },
};
