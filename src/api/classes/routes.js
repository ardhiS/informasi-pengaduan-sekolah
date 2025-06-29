const routes = (handler) => [
  {
    method: 'POST',
    path: '/classes',
    handler: handler.postClassHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/classes',
    handler: handler.getClassesHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/classes/{id}',
    handler: handler.getClassByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/classes/{id}',
    handler: handler.putClassByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/classes/{id}',
    handler: handler.deleteClassByIdHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'POST',
    path: '/classes/{id}/students',
    handler: handler.postStudentToClassHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/classes/{id}/students',
    handler: handler.getClassStudentsHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/classes/{id}/students/{studentId}',
    handler: handler.deleteStudentFromClassHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'GET',
    path: '/classes/{id}/activities',
    handler: handler.getClassActivitiesHandler,
    options: {
      auth: 'school_jwt',
    },
  },
];

module.exports = routes;
