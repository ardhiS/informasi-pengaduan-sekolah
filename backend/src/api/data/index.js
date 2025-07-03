const subjects = require('./subjects');
const classes = require('./classes');

module.exports = {
  name: 'data',
  version: '1.0.0',
  register: async (server, options) => {
    // Register subjects and classes as sub-modules
    await server.register([
      {
        plugin: subjects,
        options,
      },
      {
        plugin: classes,
        options,
      },
    ]);
  },
};
