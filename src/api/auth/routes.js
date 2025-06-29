const routes = (handler) => [
  {
    method: 'POST',
    path: '/auth/register',
    handler: handler.postRegisterHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: handler.postLoginHandler,
    options: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/auth/profile',
    handler: handler.getProfileHandler,
    options: {
      auth: 'school_jwt',
    },
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: handler.postLogoutHandler,
    options: {
      auth: 'school_jwt',
    },
  },
];

module.exports = routes;
