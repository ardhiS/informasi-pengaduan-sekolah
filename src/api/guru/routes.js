const routes = (handler) => [
  {
    method: 'POST',
    path: '/guru',
    handler: handler.postGuruHandler,
  },
  {
    method: 'GET',
    path: '/guru/{id}',
    handler: handler.getGuruByIdHandler,
  },
  {
    method: 'GET',
    path: '/guru',
    handler: handler.getAllGuruHandler,
  },
  {
    method: 'PUT',
    path: '/guru/{id}',
    handler: handler.putGuruByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/guru/{id}',
    handler: handler.deleteGuruByIdHandler,
  },
];

module.exports = routes;
