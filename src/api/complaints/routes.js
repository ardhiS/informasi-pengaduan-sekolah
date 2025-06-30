const routes = (handler) => [
  {
    method: 'POST',
    path: '/complaints',
    handler: handler.postComplaintHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/complaints',
    handler: handler.getComplaintsHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/complaints/stats',
    handler: handler.getComplaintStatsHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/complaints/{id}',
    handler: handler.getComplaintByIdHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/complaints/{id}',
    handler: handler.putComplaintHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'DELETE',
    path: '/complaints/{id}',
    handler: handler.deleteComplaintHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
