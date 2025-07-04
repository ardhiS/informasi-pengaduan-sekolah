import axios from 'axios';
import { API_ENDPOINTS } from '../constants';
import { logger, errorHandler } from '../utils/helpers';

export const usersService = {
  // GET /api/users/all (public endpoint for all users)
  getAll: async () => {
    try {
      logger.debug('Fetching all users...');
      const response = await axios.get(API_ENDPOINTS.USERS.ALL);
      logger.debug('Users fetched successfully:', response);
      return response.data;
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  },

  // GET /api/users/{id}
  getById: async (id) => {
    try {
      logger.debug('Fetching user by ID:', id);
      const response = await axios.get(`${API_ENDPOINTS.USERS.BASE}/${id}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // PUT /api/users/{id}
  update: async (id, userData) => {
    try {
      logger.info('Updating user:', id, userData);
      const response = await axios.put(
        `${API_ENDPOINTS.USERS.BASE}/${id}`,
        userData
      );
      logger.success('User updated successfully');
      return response.data;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  },

  // POST /api/users
  create: async (userData) => {
    try {
      logger.info('Creating new user:', userData);
      const response = await axios.post(API_ENDPOINTS.USERS.BASE, userData);
      logger.success('User created successfully');
      return response.data;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  },

  // DELETE /api/users/{id}
  delete: async (id) => {
    try {
      logger.info('Deleting user:', id);
      const response = await axios.delete(`${API_ENDPOINTS.USERS.BASE}/${id}`);
      logger.success('User deleted successfully');
      return response.data;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  },
};

export const complaintsService = {
  // GET /complaints/all (public endpoint for all complaints)
  getAll: async () => {
    try {
      logger.debug('Fetching all complaints...');
      const response = await axios.get(API_ENDPOINTS.COMPLAINTS.ALL);
      logger.debug('Complaints fetched successfully:', response);
      return response.data;
    } catch (error) {
      logger.warn('Complaints endpoint not available or failed:', error);
      // If endpoint doesn't exist or returns error, return empty array
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

  // GET /api/complaints/{id}
  getById: async (id) => {
    try {
      logger.debug('Fetching complaint by ID:', id);
      const response = await axios.get(
        `${API_ENDPOINTS.COMPLAINTS.BASE}/${id}`
      );
      return response.data;
    } catch (error) {
      logger.error('Error fetching complaint by ID:', error);
      throw error;
    }
  },

  // POST /api/complaints
  create: async (complaintData) => {
    try {
      logger.info('Creating new complaint:', complaintData);
      const response = await axios.post(
        API_ENDPOINTS.COMPLAINTS.BASE,
        complaintData
      );
      logger.success('Complaint created successfully');
      return response.data;
    } catch (error) {
      logger.error('Error creating complaint:', error);
      throw error;
    }
  },

  // PUT /api/complaints/{id}
  update: async (id, complaintData) => {
    try {
      logger.info('Updating complaint:', id, complaintData);
      const response = await axios.put(
        `${API_ENDPOINTS.COMPLAINTS.BASE}/${id}`,
        complaintData
      );
      logger.success('Complaint updated successfully');
      return response.data;
    } catch (error) {
      logger.error('Error updating complaint:', error);
      throw error;
    }
  },

  // DELETE /api/complaints/{id}
  delete: async (id) => {
    try {
      logger.info('Deleting complaint:', id);
      const response = await axios.delete(
        `${API_ENDPOINTS.COMPLAINTS.BASE}/${id}`
      );
      logger.success('Complaint deleted successfully');
      return response.data;
    } catch (error) {
      logger.error('Error deleting complaint:', error);
      throw error;
    }
  },
};

export const collaborationsService = {
  // POST /api/collaborations
  create: async (collaborationData) => {
    try {
      logger.info('Creating new collaboration:', collaborationData);
      const response = await axios.post(
        API_ENDPOINTS.COLLABORATIONS.BASE,
        collaborationData
      );
      logger.success('Collaboration created successfully');
      return response.data;
    } catch (error) {
      logger.error('Error creating collaboration:', error);
      throw error;
    }
  },

  // DELETE /api/collaborations
  delete: async (collaborationData) => {
    try {
      logger.info('Deleting collaboration:', collaborationData);
      const response = await axios.delete(API_ENDPOINTS.COLLABORATIONS.BASE, {
        data: collaborationData,
      });
      logger.success('Collaboration deleted successfully');
      return response.data;
    } catch (error) {
      logger.error('Error deleting collaboration:', error);
      throw error;
    }
  },
};
