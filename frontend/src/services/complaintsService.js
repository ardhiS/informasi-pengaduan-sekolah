import api from './api'; // Gunakan API instance yang sudah dikonfigurasi

class ComplaintsService {
  // Create new complaint
  async create(complaintData) {
    try {
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

      const response = await api.post('/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

      // Try authenticated endpoint first
      try {
        const response = await api.get(`/complaints?${params.toString()}`);
        return response.data.data.complaints; // Backend returns {status: 'success', data: {complaints: [...], user_info: {...}}}
      } catch (authError) {
        // If authentication fails (401, 403), check if token expired
        if (
          authError.response &&
          [401, 403].includes(authError.response.status)
        ) {
          console.log('Authentication failed, checking if token expired...');

          // Check if message indicates token issue
          const errorMessage = authError.response?.data?.message || '';
          if (
            errorMessage.includes('token') ||
            errorMessage.includes('expired')
          ) {
            console.log('Token expired, redirecting to login...');
            // Clear tokens and redirect
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login/siswa';
            return [];
          }

          // Try public endpoint as fallback
          console.log('Trying public endpoint...');
          const publicResponse = await api.get('/complaints/all');
          return (
            publicResponse.data.data.complaints ||
            publicResponse.data.complaints ||
            []
          );
        }
        // Re-throw other errors
        throw authError;
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  }

  // Get complaint by ID
  async getById(id) {
    try {
      const response = await api.get(`/complaints/${id}`);
      return response.data.data.complaint; // Backend returns {status: 'success', data: {complaint: {...}}}
    } catch (error) {
      console.error('Error fetching complaint:', error);
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

      const response = await api.put(`/complaints/${id}`, filteredData);
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
      // Try authenticated endpoint first
      try {
        const response = await api.get('/complaints/stats');
        return response.data.data.stats;
      } catch (authError) {
        // If authentication fails, return basic stats from public endpoint
        if (
          authError.response &&
          [401, 403].includes(authError.response.status)
        ) {
          console.log(
            'Authentication failed for stats, returning basic stats...'
          );
          const publicResponse = await api.get('/complaints/all');
          const complaints =
            publicResponse.data.data.complaints ||
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
            basicStats.byStatus[status] =
              (basicStats.byStatus[status] || 0) + 1;

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
        }
        // Re-throw other errors
        throw authError;
      }
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
      { value: 'pending_approval', label: 'Pending Approval', color: 'yellow' },
      { value: 'approved', label: 'Approved', color: 'green' },
      { value: 'rejected', label: 'Rejected', color: 'red' },
      { value: 'in_progress', label: 'In Progress', color: 'blue' },
      { value: 'resolved', label: 'Resolved', color: 'green' },
      { value: 'closed', label: 'Closed', color: 'gray' },
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

  // Approve complaint (admin only)
  async approve(id) {
    try {
      const response = await api.put(`/complaints/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving complaint:', error);
      throw error;
    }
  }

  // Reject complaint (admin only)
  async reject(id, reason) {
    try {
      const response = await api.put(`/complaints/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting complaint:', error);
      throw error;
    }
  }

  // Update complaint progress (guru and admin)
  async updateProgress(id, status, notes) {
    try {
      const response = await api.put(`/complaints/${id}/progress`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating complaint progress:', error);
      throw error;
    }
  }

  // Get my complaints (user's own complaints)
  async getMy() {
    try {
      const response = await api.get('/complaints/my');
      return response.data.data.complaints;
    } catch (error) {
      console.error('Error fetching my complaints:', error);
      throw error;
    }
  }

  // Get assigned complaints (for guru)
  async getAssigned() {
    try {
      const response = await api.get('/complaints/assigned');
      return response.data.data.complaints;
    } catch (error) {
      console.error('Error fetching assigned complaints:', error);
      throw error;
    }
  }
}

const complaintsService = new ComplaintsService();
export default complaintsService;
