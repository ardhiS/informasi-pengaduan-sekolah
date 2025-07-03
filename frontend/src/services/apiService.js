import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-api.com'
    : 'http://localhost:3000';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add auth token to all requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshToken();
          return this.api.request(error.config);
        }
        throw error;
      }
    );
  }

  // Auth methods
  async login(credentials) {
    const response = await this.api.post('/api/auth/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/api/auth/register', userData);
    return response.data;
  }

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.api.delete('/api/auth/logout', {
      data: { refreshToken },
    });
    return response.data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await this.api.put('/api/auth/refresh', { refreshToken });
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/api/auth/profile');
    return response.data;
  }

  // Users methods
  async getUsers(params = {}) {
    const response = await this.api.get('/api/users', { params });
    return response.data;
  }

  async createUser(userData) {
    const response = await this.api.post('/api/users', userData);
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await this.api.put(`/api/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id) {
    const response = await this.api.delete(`/api/users/${id}`);
    return response.data;
  }

  async getUserStats() {
    const response = await this.api.get('/api/users/stats');
    return response.data;
  }

  // Complaints methods
  async getComplaints(params = {}) {
    const response = await this.api.get('/api/complaints', { params });
    return response.data;
  }

  async createComplaint(complaintData) {
    const response = await this.api.post('/api/complaints', complaintData);
    return response.data;
  }

  async updateComplaint(id, complaintData) {
    const response = await this.api.put(`/api/complaints/${id}`, complaintData);
    return response.data;
  }

  async deleteComplaint(id) {
    const response = await this.api.delete(`/api/complaints/${id}`);
    return response.data;
  }

  // Classes methods
  async getClasses(params = {}) {
    const response = await this.api.get('/api/classes', { params });
    return response.data;
  }

  async createClass(classData) {
    const response = await this.api.post('/api/classes', classData);
    return response.data;
  }

  async updateClass(id, classData) {
    const response = await this.api.put(`/api/classes/${id}`, classData);
    return response.data;
  }

  async deleteClass(id) {
    const response = await this.api.delete(`/api/classes/${id}`);
    return response.data;
  }

  // Subjects methods
  async getSubjects(params = {}) {
    const response = await this.api.get('/api/subjects', { params });
    return response.data;
  }

  async createSubject(subjectData) {
    const response = await this.api.post('/api/subjects', subjectData);
    return response.data;
  }

  async updateSubject(id, subjectData) {
    const response = await this.api.put(`/api/subjects/${id}`, subjectData);
    return response.data;
  }

  async deleteSubject(id) {
    const response = await this.api.delete(`/api/subjects/${id}`);
    return response.data;
  }

  // Legacy compatibility methods
  async getGuru(params = {}) {
    return this.getUsers({ ...params, role: 'guru' });
  }

  async getSiswa(params = {}) {
    return this.getUsers({ ...params, role: 'siswa' });
  }

  async createGuru(userData) {
    return this.createUser({ ...userData, role: 'guru' });
  }

  async createSiswa(userData) {
    return this.createUser({ ...userData, role: 'siswa' });
  }
}

export default new ApiService();
