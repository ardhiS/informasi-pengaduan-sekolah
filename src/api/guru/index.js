const GuruHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'guru',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const guruHandler = new GuruHandler(service, validator);
    server.route(routes(guruHandler));
  },
};
