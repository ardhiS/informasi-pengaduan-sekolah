import api from './api';

export const subjectsService = {
  // GET /subjects/all (public endpoint for all subjects)
  getAll: async () => {
    const response = await api.get('/subjects/all');
    return response.data;
  },

  // GET /subjects/{id}
  getById: async (id) => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  // POST /subjects
  create: async (subjectData) => {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  },

  // PUT /subjects/{id}
  update: async (id, subjectData) => {
    const response = await api.put(`/subjects/${id}`, subjectData);
    return response.data;
  },

  // DELETE /subjects/{id}
  delete: async (id) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },
};

export const classesService = {
  // GET /classes/all (public endpoint for all classes)
  getAll: async () => {
    const response = await api.get('/classes/all');
    return response.data;
  },

  // GET /classes/{id}
  getById: async (id) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  // POST /classes
  create: async (classData) => {
    const response = await api.post('/classes', classData);
    return response.data;
  },

  // PUT /classes/{id}
  update: async (id, classData) => {
    const response = await api.put(`/classes/${id}`, classData);
    return response.data;
  },

  // DELETE /classes/{id}
  delete: async (id) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },

  // GET /classes/{id}/activities
  getActivities: async (id) => {
    const response = await api.get(`/classes/${id}/activities`);
    return response.data;
  },

  // GET /classes/{id}/collaborations
  getCollaborations: async (id) => {
    const response = await api.get(`/classes/${id}/collaborations`);
    return response.data;
  },
};

export const usersService = {
  // GET /users/all (public endpoint for all users)
  getAll: async () => {
    const response = await api.get('/users/all');
    return response.data;
  },

  // GET /users/{id}
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // PUT /users/{id}
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
};

export const complaintsService = {
  // GET /complaints/all (public endpoint for all complaints)
  getAll: async () => {
    try {
      const response = await api.get('/complaints/all');
      return response.data;
    } catch (error) {
      // If endpoint doesn't exist or returns error, return empty array
      console.warn(
        'Complaints endpoint not available or failed:',
        error.message
      );
      return {
        data: {
          complaints: [],
        },
        complaints: [],
        success: false,
        message: 'Complaints endpoint not available',
      };
    }
  },

  // GET /complaints/{id}
  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // POST /complaints
  create: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },

  // PUT /complaints/{id}
  update: async (id, complaintData) => {
    const response = await api.put(`/complaints/${id}`, complaintData);
    return response.data;
  },

  // DELETE /complaints/{id}
  delete: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
};

export const collaborationsService = {
  // POST /collaborations
  create: async (collaborationData) => {
    const response = await api.post('/collaborations', collaborationData);
    return response.data;
  },

  // DELETE /collaborations
  delete: async (collaborationData) => {
    const response = await api.delete('/collaborations', {
      data: collaborationData,
    });
    return response.data;
  },
};
