import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor untuk authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor untuk error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ComplaintsService {
  // Create new complaint
  async create(complaintData) {
    try {
      const response = await api.post('/complaints', complaintData);
      return response.data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  // Get all complaints with filters
  async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);

      const response = await api.get(`/complaints?${params.toString()}`);
      return response.data.data.complaints;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  }

  // Get complaint by ID
  async getById(id) {
    try {
      const response = await api.get(`/complaints/${id}`);
      return response.data.data.complaint;
    } catch (error) {
      console.error('Error fetching complaint:', error);
      throw error;
    }
  }

  // Update complaint
  async update(id, complaintData) {
    try {
      const response = await api.put(`/complaints/${id}`, complaintData);
      return response.data;
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  }

  // Delete complaint
  async delete(id) {
    try {
      const response = await api.delete(`/complaints/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  }

  // Get complaint statistics
  async getStats() {
    try {
      const response = await api.get('/complaints/stats');
      return response.data.data.stats;
    } catch (error) {
      console.error('Error fetching complaint stats:', error);
      throw error;
    }
  }

  // Get categories
  getCategories() {
    return [
      { value: 'akademik', label: 'Akademik', icon: '📚' },
      { value: 'fasilitas', label: 'Fasilitas', icon: '🏢' },
      { value: 'bullying', label: 'Bullying/Kekerasan', icon: '⚠️' },
      { value: 'guru', label: 'Tenaga Pendidik', icon: '👨‍🏫' },
      { value: 'administrasi', label: 'Administrasi', icon: '📋' },
      { value: 'keamanan', label: 'Keamanan', icon: '🔒' },
      { value: 'kebersihan', label: 'Kebersihan', icon: '🧽' },
      { value: 'lainnya', label: 'Lainnya', icon: '💬' },
    ];
  }

  // Get priorities
  getPriorities() {
    return [
      { value: 'low', label: 'Rendah', color: 'gray' },
      { value: 'medium', label: 'Sedang', color: 'yellow' },
      { value: 'high', label: 'Tinggi', color: 'orange' },
      { value: 'urgent', label: 'Mendesak', color: 'red' },
    ];
  }

  // Get statuses
  getStatuses() {
    return [
      { value: 'pending', label: 'Menunggu', color: 'yellow' },
      { value: 'process', label: 'Diproses', color: 'blue' },
      { value: 'resolved', label: 'Selesai', color: 'green' },
      { value: 'closed', label: 'Ditutup', color: 'gray' },
    ];
  }

  // Get reporter types
  getReporterTypes() {
    return [
      { value: 'siswa', label: 'Siswa' },
      { value: 'orangtua', label: 'Orang Tua' },
      { value: 'guru', label: 'Guru' },
      { value: 'staff', label: 'Staff' },
    ];
  }
}

const complaintsService = new ComplaintsService();
export default complaintsService;
