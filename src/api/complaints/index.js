const ComplaintsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'complaints',
  version: '1.0.0',
  register: async (server) => {
    const complaintsHandler = new ComplaintsHandler();
    server.route(routes(complaintsHandler));
  },
};
