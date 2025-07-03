const ComplaintsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'complaints',
  version: '1.0.0',
  register: async (server, options) => {
    const complaintsHandler = new ComplaintsHandler(
      options.service,
      options.validator
    );
    server.route(routes(complaintsHandler));
  },
};
