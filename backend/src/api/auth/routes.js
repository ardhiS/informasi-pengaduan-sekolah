const handler = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/api/auth/register',
    handler: handler.registerHandler,
    options: { auth: false },
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: handler.loginHandler,
    options: { auth: false },
  },
  {
    method: 'DELETE',
    path: '/api/auth/logout',
    handler: handler.logoutHandler,
  },
  {
    method: 'PUT',
    path: '/api/auth/refresh',
    handler: handler.refreshHandler,
  },
  {
    method: 'GET',
    path: '/api/auth/profile',
    handler: handler.getProfileHandler,
  },
  // Legacy compatibility routes
  {
    method: 'POST',
    path: '/api/authentications',
    handler: handler.loginHandler,
    options: { auth: false },
  },
  {
    method: 'PUT',
    path: '/api/authentications',
    handler: handler.refreshHandler,
  },
  {
    method: 'DELETE',
    path: '/api/authentications',
    handler: handler.logoutHandler,
  },
];

module.exports = routes;
