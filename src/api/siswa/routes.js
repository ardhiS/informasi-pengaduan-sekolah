const routes = (handler) => [
  {
    method: 'POST',
    path: '/siswa',
    handler: handler.postSiswaHandler,
  },
  {
    method: 'GET',
    path: '/siswa/{id}',
    handler: handler.getSiswaByIdHandler,
  },
  {
    method: 'GET',
    path: '/siswa',
    handler: handler.getAllSiswaHandler,
  },
  {
    method: 'PUT',
    path: '/siswa/{id}',
    handler: handler.putSiswaByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/siswa/{id}',
    handler: handler.deleteSiswaByIdHandler,
  },
];

module.exports = routes;
