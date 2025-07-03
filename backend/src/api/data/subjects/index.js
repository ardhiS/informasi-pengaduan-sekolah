const SubjectsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'subjects',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const subjectsHandler = new SubjectsHandler(service, validator);
    server.route(routes(subjectsHandler));
  },
};
