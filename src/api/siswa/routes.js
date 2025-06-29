const routes = (handler) => [
  {
    method: 'POST',
    path: '/siswa',
    handler: handler.postSiswaHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/siswa/{id}',
    handler: handler.getSiswaByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/siswa',
    handler: handler.getAllSiswaHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/siswa/{id}',
    handler: handler.putSiswaByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/siswa/{id}',
    handler: handler.deleteSiswaByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
];

module.exports = routes;
