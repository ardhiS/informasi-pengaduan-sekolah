const routes = (handler) => [
  {
    method: 'POST',
    path: '/subjects',
    handler: handler.postSubjectHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/subjects',
    handler: handler.getSubjectsHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/subjects/all',
    handler: handler.getAllSubjectsHandler,
  },
  {
    method: 'GET',
    path: '/subjects/{id}',
    handler: handler.getSubjectByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/subjects/{id}',
    handler: handler.putSubjectByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/subjects/{id}',
    handler: handler.deleteSubjectByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
];

module.exports = routes;
