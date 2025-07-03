const handler = require('./handler');

const routes = [
  // Main user routes
  {
    method: 'GET',
    path: '/api/users',
    handler: handler.getUsersHandler,
  },
  {
    method: 'POST',
    path: '/api/users',
    handler: handler.addUserHandler,
  },
  {
    method: 'GET',
    path: '/api/users/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'PUT',
    path: '/api/users/{id}',
    handler: handler.putUserHandler,
  },
  {
    method: 'DELETE',
    path: '/api/users/{id}',
    handler: handler.deleteUserHandler,
  },
  {
    method: 'GET',
    path: '/api/users/stats',
    handler: handler.getUserStatsHandler,
  },
  {
    method: 'GET',
    path: '/api/users/all',
    handler: handler.getUsersHandler, // Use existing handler for all users
  },

  // Legacy compatibility routes for guru
  {
    method: 'GET',
    path: '/api/guru',
    handler: handler.getGuruHandler,
  },
  {
    method: 'POST',
    path: '/api/guru',
    handler: handler.addGuruHandler,
  },
  {
    method: 'GET',
    path: '/api/guru/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'PUT',
    path: '/api/guru/{id}',
    handler: handler.putUserHandler,
  },
  {
    method: 'DELETE',
    path: '/api/guru/{id}',
    handler: handler.deleteUserHandler,
  },

  // Legacy compatibility routes for siswa
  {
    method: 'GET',
    path: '/api/siswa',
    handler: handler.getSiswaHandler,
  },
  {
    method: 'POST',
    path: '/api/siswa',
    handler: handler.addSiswaHandler,
  },
  {
    method: 'GET',
    path: '/api/siswa/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'PUT',
    path: '/api/siswa/{id}',
    handler: handler.putUserHandler,
  },
  {
    method: 'DELETE',
    path: '/api/siswa/{id}',
    handler: handler.deleteUserHandler,
  },
];

module.exports = routes;
