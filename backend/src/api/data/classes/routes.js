const routes = (handler) => [
  {
    method: 'POST',
    path: '/api/classes',
    handler: handler.postClassHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/classes',
    handler: handler.getClassesHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/classes/all',
    handler: handler.getAllClassesHandler,
  },
  {
    method: 'GET',
    path: '/api/classes/{id}',
    handler: handler.getClassByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/api/classes/{id}',
    handler: handler.putClassByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/api/classes/{id}',
    handler: handler.deleteClassByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'POST',
    path: '/api/classes/{id}/students',
    handler: handler.postStudentToClassHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/classes/{id}/students',
    handler: handler.getClassStudentsHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/api/classes/{id}/students/{studentId}',
    handler: handler.deleteStudentFromClassHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/api/classes/{id}/activities',
    handler: handler.getClassActivitiesHandler,
    options: {
      auth: 'school_jwt',
    },
  },
];

module.exports = routes;
