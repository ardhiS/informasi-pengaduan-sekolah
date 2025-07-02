const routes = (handler) => [
  // Public endpoint for getting complaints count (no auth required)
  {
    method: 'GET',
    path: '/complaints/all',
    handler: handler.getAllComplaintsHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'POST',
    path: '/complaints',
    handler: handler.postComplaintHandler,
    options: {
      auth: 'school_jwt', // Require authentication
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
      auth: 'school_jwt', // Require authentication
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/complaints/my',
    handler: handler.getMyComplaintsHandler,
    options: {
      auth: 'school_jwt', // Get complaints created by current user
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'GET',
    path: '/complaints/assigned',
    handler: handler.getAssignedComplaintsHandler,
    options: {
      auth: 'school_jwt', // Get complaints assigned to current user (guru/admin)
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
      auth: 'school_jwt', // Require authentication
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
      auth: 'school_jwt', // Require authentication
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
      auth: 'school_jwt', // Require authentication
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/complaints/{id}/status',
    handler: handler.updateComplaintStatusHandler,
    options: {
      auth: 'school_jwt', // Update only status (guru/admin)
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/complaints/{id}/assign',
    handler: handler.assignComplaintHandler,
    options: {
      auth: 'school_jwt', // Assign complaint to user (admin only)
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
      auth: 'school_jwt', // Require authentication - Only admin can delete
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
