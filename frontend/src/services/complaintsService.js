import axios from 'axios';
import {
  API_CONFIG,
  API_ENDPOINTS,
  COMPLAINT_STATUS,
  COMPLAINT_PRIORITY,
  COMPLAINT_CATEGORIES,
  STORAGE_KEYS,
} from '../constants';
import { logger, errorHandler, storage } from '../utils/helpers';

const BASE_URL = import.meta.env.DEV ? '' : API_CONFIG.BASE_URL;

function getAuthHeaders() {
  const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

class ComplaintsService {
  // Create new complaint
  async create(complaintData) {
    try {
      logger.info('Creating new complaint:', complaintData);

      // Use FormData for multipart/form-data with image support
      const formData = new FormData();

      // Add text fields
      const allowedFields = [
        'title',
        'description',
        'category',
        'priority',
        'reporter_name',
        'reporter_email',
        'reporter_phone',
        'reporter_type',
        'reporter_class',
      ];

      allowedFields.forEach((field) => {
        if (complaintData[field] !== undefined && complaintData[field] !== '') {
          formData.append(field, complaintData[field]);
        }
      });

      // Add images if any
      if (complaintData.images && complaintData.images.length > 0) {
        complaintData.images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await axios.post(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      logger.success('Complaint created successfully');
      return response.data;
    } catch (error) {
      logger.error('Error creating complaint:', error);
      throw error;
    }
  }

  // Get all complaints with filters
  async getAll(filters = {}) {
    try {
      console.log('📡 complaintsService.getAll called with filters:', filters);
      logger.debug('Fetching complaints with filters:', filters);

      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      // Try authenticated endpoint first, fallback to public if needed
      try {
        console.log('🔐 Trying authenticated endpoint...');
        const response = await axios.get(
          `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}?${params.toString()}`,
          { headers: getAuthHeaders() }
        );
        logger.debug('Authenticated complaints response:', response);
        console.log('✅ Authenticated endpoint successful, returning data');
        return response.data.data?.complaints || response.data.complaints || [];
      } catch (authError) {
        console.log(
          '⚠️ Authenticated endpoint failed, trying public endpoint...'
        );
        logger.warn(
          'Authenticated endpoint failed, trying public endpoint:',
          authError
        );

        // Fallback to public endpoint
        const response = await axios.get(
          `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.PUBLIC}?${params.toString()}`
        );
        logger.debug('Public complaints response:', response);
        console.log('✅ Public endpoint successful, returning data');
        return response.data.data?.complaints || response.data.complaints || [];
      }
    } catch (error) {
      console.error('❌ complaintsService.getAll error:', error);
      logger.error('Error fetching complaints:', error);
      throw error;
    }
  }

  // Helper method to get public complaints
  async getPublicComplaints() {
    try {
      logger.debug('Fetching public complaints...');
      const publicResponse = await axios.get(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.PUBLIC}`
      );
      return (
        publicResponse.data.data?.complaints ||
        publicResponse.data.complaints ||
        []
      );
    } catch (publicError) {
      logger.error('Public endpoint failed:', publicError);
      return [];
    }
  }

  // Get complaint by ID
  async getById(id) {
    try {
      const response = await axios.get(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data.data.complaint; // Backend returns {status: 'success', data: {complaint: {...}}}
    } catch (error) {
      logger.error('Error fetching complaint:', error);
      throw error;
    }
  }

  // Update complaint
  async update(id, complaintData) {
    try {
      // Filter out fields that are not allowed for updating complaints
      const allowedFields = [
        'title',
        'description',
        'category',
        'status',
        'priority',
        'assigned_to',
        'admin_notes',
        'resolution',
      ];

      const filteredData = {};
      allowedFields.forEach((field) => {
        if (complaintData[field] !== undefined) {
          filteredData[field] = complaintData[field];
        }
      });

      const response = await axios.put(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/${id}`,
        filteredData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      logger.error('Error updating complaint:', error);
      throw error;
    }
  }

  // Delete complaint
  async delete(id) {
    try {
      const response = await axios.delete(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/${id}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      logger.error('Error deleting complaint:', error);
      throw error;
    }
  }

  // Get complaint statistics
  async getStats() {
    try {
      logger.debug('Fetching complaint statistics...');

      // Try authenticated endpoint first
      try {
        const response = await axios.get(
          `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.STATS}`,
          { headers: getAuthHeaders() }
        );
        logger.debug('Authenticated stats response:', response);
        return response.data.data?.stats || response.data.stats || {};
      } catch (authError) {
        logger.warn(
          'Authentication failed for stats, using basic calculation:',
          authError
        );
        // Fallback to basic stats calculation
        return this.calculateBasicStats();
      }
    } catch (error) {
      logger.error('Error fetching complaint stats:', error);
      // Return basic stats instead of throwing
      return this.calculateBasicStats();
    }
  }

  // Helper method to calculate basic stats from public data
  async calculateBasicStats() {
    try {
      const publicResponse = await axios.get(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.PUBLIC}`
      );
      const complaints =
        publicResponse.data.data?.complaints ||
        publicResponse.data.complaints ||
        [];

      // Calculate basic stats from public data
      const basicStats = {
        total: complaints.length,
        byStatus: {},
        byCategory: {},
        byPriority: {},
        recent: complaints.filter((c) => {
          const createdDate = new Date(c.reported_at || c.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return createdDate >= weekAgo;
        }).length,
      };

      complaints.forEach((complaint) => {
        // Count by status
        const status = complaint.status || 'pending';
        basicStats.byStatus[status] = (basicStats.byStatus[status] || 0) + 1;

        // Count by category
        const category = complaint.category || 'lainnya';
        basicStats.byCategory[category] =
          (basicStats.byCategory[category] || 0) + 1;

        // Count by priority
        const priority = complaint.priority || 'medium';
        basicStats.byPriority[priority] =
          (basicStats.byPriority[priority] || 0) + 1;
      });

      return basicStats;
    } catch (error) {
      logger.error('Error calculating basic stats:', error);
      // Return empty stats object
      return {
        total: 0,
        byStatus: {},
        byCategory: {},
        byPriority: {},
        recent: 0,
      };
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

  // Get priorities using constants
  getPriorities() {
    return Object.values(COMPLAINT_PRIORITY).map((priority) => ({
      value: priority,
      label: this.getPriorityLabel(priority),
      color: this.getPriorityColor(priority),
    }));
  }

  // Get statuses using constants
  getStatuses() {
    return Object.values(COMPLAINT_STATUS).map((status) => ({
      value: status,
      label: this.getStatusLabel(status),
      color: this.getStatusColor(status),
    }));
  }

  // Helper methods for labels and colors
  getPriorityLabel(priority) {
    const labels = {
      [COMPLAINT_PRIORITY.LOW]: 'Rendah',
      [COMPLAINT_PRIORITY.MEDIUM]: 'Sedang',
      [COMPLAINT_PRIORITY.HIGH]: 'Tinggi',
      [COMPLAINT_PRIORITY.URGENT]: 'Mendesak',
    };
    return labels[priority] || priority;
  }

  getPriorityColor(priority) {
    const colors = {
      [COMPLAINT_PRIORITY.LOW]: 'gray',
      [COMPLAINT_PRIORITY.MEDIUM]: 'yellow',
      [COMPLAINT_PRIORITY.HIGH]: 'orange',
      [COMPLAINT_PRIORITY.URGENT]: 'red',
    };
    return colors[priority] || 'gray';
  }

  getStatusLabel(status) {
    const labels = {
      [COMPLAINT_STATUS.PENDING]: 'Pending',
      [COMPLAINT_STATUS.IN_PROGRESS]: 'In Progress',
      [COMPLAINT_STATUS.RESOLVED]: 'Resolved',
      [COMPLAINT_STATUS.CLOSED]: 'Closed',
      [COMPLAINT_STATUS.REJECTED]: 'Rejected',
    };
    return labels[status] || status;
  }

  getStatusColor(status) {
    const colors = {
      [COMPLAINT_STATUS.PENDING]: 'yellow',
      [COMPLAINT_STATUS.IN_PROGRESS]: 'blue',
      [COMPLAINT_STATUS.RESOLVED]: 'green',
      [COMPLAINT_STATUS.CLOSED]: 'gray',
      [COMPLAINT_STATUS.REJECTED]: 'red',
    };
    return colors[status] || 'gray';
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

  // Approve complaint (admin only)
  async approve(id) {
    try {
      const response = await axios.put(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/${id}/approve`,
        {},
        { headers: getAuthHeaders() }
      );
      logger.success('Complaint approved successfully');
      return response.data;
    } catch (error) {
      logger.error('Error approving complaint:', error);
      throw error;
    }
  }

  // Reject complaint (admin only)
  async reject(id, reason) {
    try {
      const response = await axios.put(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/${id}/reject`,
        { reason },
        { headers: getAuthHeaders() }
      );
      logger.success('Complaint rejected successfully');
      return response.data;
    } catch (error) {
      logger.error('Error rejecting complaint:', error);
      throw error;
    }
  }

  // Update complaint progress (guru and admin)
  async updateProgress(id, status, notes) {
    try {
      const response = await axios.put(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/${id}/progress`,
        { status, notes },
        { headers: getAuthHeaders() }
      );
      logger.success('Complaint progress updated successfully');
      return response.data;
    } catch (error) {
      logger.error('Error updating complaint progress:', error);
      throw error;
    }
  }

  // Get my complaints (user's own complaints)
  async getMy() {
    try {
      const response = await axios.get(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/my`,
        { headers: getAuthHeaders() }
      );
      return response.data.data.complaints;
    } catch (error) {
      logger.error('Error fetching my complaints:', error);
      throw error;
    }
  }

  // Get assigned complaints (for guru)
  async getAssigned() {
    try {
      const response = await axios.get(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/assigned`,
        { headers: getAuthHeaders() }
      );
      return response.data.data.complaints;
    } catch (error) {
      logger.error('Error fetching assigned complaints:', error);
      throw error;
    }
  }

  // Update complaint status
  async updateStatus(id, newStatus) {
    try {
      const response = await axios.put(
        `${BASE_URL}${API_ENDPOINTS.COMPLAINTS.BASE}/${id}/status`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      logger.success('Complaint status updated successfully');
      return response.data;
    } catch (error) {
      logger.error('Error updating complaint status:', error);
      throw error;
    }
  }

  // Method aliases for compatibility with Complaints component
  async getComplaints(filters = {}) {
    console.log(
      '🔍 complaintsService.getComplaints called with filters:',
      filters
    );
    const complaints = await this.getAll(filters);
    console.log(
      '📋 complaintsService.getComplaints returning:',
      complaints.length,
      'complaints'
    );
    return { complaints };
  }

  async createComplaint(complaintData) {
    return this.create(complaintData);
  }

  async updateComplaint(id, complaintData) {
    return this.update(id, complaintData);
  }

  async deleteComplaint(id) {
    return this.delete(id);
  }

  async approveComplaint(id) {
    return this.approve(id);
  }

  async rejectComplaint(id, reason) {
    return this.reject(id, reason);
  }

  async updateComplaintStatus(id, newStatus) {
    return this.updateStatus(id, newStatus);
  }
}

const complaintsService = new ComplaintsService();
export default complaintsService;
