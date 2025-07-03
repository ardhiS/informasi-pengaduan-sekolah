const routes = (handler) => [
  // Public endpoint for getting complaints count (no auth required)
  {
    method: 'GET',
    path: '/api/complaints/all',
    handler: handler.getAllComplaintsHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'POST',
    path: '/api/complaints',
    handler: handler.postComplaintHandler,
    options: {
      auth: 'school_jwt', // Require authentication
      cors: {
        origin: ['*'],
      },
      payload: {
        output: 'data',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 10 * 1024 * 1024, // 10MB limit
      },
    },
  },
  {
    method: 'GET',
    path: '/api/complaints',
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
    path: '/api/complaints/my',
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
    path: '/api/complaints/assigned',
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
    path: '/api/complaints/stats',
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
    path: '/api/complaints/{id}',
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
    path: '/api/complaints/{id}',
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
    path: '/api/complaints/{id}/status',
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
    path: '/api/complaints/{id}/assign',
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
    path: '/api/complaints/{id}',
    handler: handler.deleteComplaintHandler,
    options: {
      auth: 'school_jwt', // Require authentication - Only admin can delete
      cors: {
        origin: ['*'],
      },
    },
  },
  // New routes for approval and progress
  {
    method: 'PUT',
    path: '/api/complaints/{id}/approve',
    handler: handler.approveComplaintHandler,
    options: {
      auth: 'school_jwt', // Admin only
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/complaints/{id}/reject',
    handler: handler.rejectComplaintHandler,
    options: {
      auth: 'school_jwt', // Admin only
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/complaints/{id}/progress',
    handler: handler.updateProgressHandler,
    options: {
      auth: 'school_jwt', // Guru and admin
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
