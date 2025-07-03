const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/subjects',
    handler: handler.postSubjectHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/subjects',
    handler: handler.getSubjectsHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/subjects/all',
    handler: handler.getAllSubjectsHandler,
  },
  {
    method: 'GET',
    path: '/api/subjects/{id}',
    handler: handler.getSubjectByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/api/subjects/{id}',
    handler: handler.putSubjectByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/api/subjects/{id}',
    handler: handler.deleteSubjectByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
];

module.exports = routes;
