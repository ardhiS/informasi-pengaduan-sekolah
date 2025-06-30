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
  // GET /users
  getAll: async () => {
    const response = await api.get('/users');
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
