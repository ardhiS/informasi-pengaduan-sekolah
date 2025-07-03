const ClassesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'classes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const classesHandler = new ClassesHandler(service, validator);
    server.route(routes(classesHandler));
  },
};
