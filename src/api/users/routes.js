const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users/all',
    handler: handler.getAllUsersHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: handler.putUserByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: handler.deleteUserByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
];

module.exports = routes;
