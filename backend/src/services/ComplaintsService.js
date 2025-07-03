const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoudError');

class ComplaintsService {
  constructor() {
    try {
      this._pool = new Pool();
      console.log('✅ ComplaintsService: Database pool initialized');
    } catch (error) {
      console.error(
        '❌ ComplaintsService: Failed to initialize database pool:',
        error
      );
      throw error;
    }
  }

  async addComplaint({
    title,
    description,
    category,
    reporter_name,
    reporter_email,
    reporter_phone,
    reporter_type,
    reporter_class,
    priority = 'medium',
    user_id = null,
    images = [], // Array of image file paths
  }) {
    const client = await this._pool.connect();

    try {
      await client.query('BEGIN');

      // Insert complaint
      const complaintQuery = {
        text: `INSERT INTO complaints 
               (title, description, category, reporter_name, reporter_email, 
                reporter_phone, reporter_type, reporter_class, priority, status, 
                approval_status, reported_at, user_id) 
               VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), $12) 
               RETURNING id`,
        values: [
          title,
          description,
          category,
          reporter_name,
          reporter_email,
          reporter_phone,
          reporter_type,
          reporter_class,
          priority,
          'pending_approval', // Default status
          'pending_approval', // Default approval status
          user_id,
        ],
      };

      const complaintResult = await client.query(complaintQuery);
      const complaintId = complaintResult.rows[0].id;

      // Insert images if any
      if (images && images.length > 0) {
        for (const image of images) {
          // Validate image object has required properties and not null/empty
          if (
            image &&
            image.filename &&
            image.originalname &&
            image.path &&
            image.size &&
            image.mimetype
          ) {
            const imageQuery = {
              text: `INSERT INTO complaint_images 
                     (complaint_id, filename, original_name, file_path, file_size, mime_type)
                     VALUES($1, $2, $3, $4, $5, $6)`,
              values: [
                complaintId,
                image.filename,
                image.originalname,
                image.path,
                image.size,
                image.mimetype,
              ],
            };
            await client.query(imageQuery);
          } else {
            console.log('⚠️ Skipping invalid image object:', image);
          }
        }
      }

      await client.query('COMMIT');
      return complaintId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllComplaints({
    status = null,
    category = null,
    priority = null,
    user_id = null,
    approval_status = null,
    user_role = null,
    limit = 50,
    offset = 0,
  } = {}) {
    let whereConditions = [];
    let values = [];
    let valueIndex = 1;

    // Role-based filtering
    if (user_role === 'siswa' || user_role === 'guru') {
      // Students and teachers only see approved complaints
      whereConditions.push(`c.approval_status = $${valueIndex++}`);
      values.push('approved');
    } else if (user_role === 'admin') {
      // Admin sees all complaints
      if (approval_status) {
        whereConditions.push(`c.approval_status = $${valueIndex++}`);
        values.push(approval_status);
      }
    }

    if (status) {
      whereConditions.push(`c.status = $${valueIndex++}`);
      values.push(status);
    }

    if (category) {
      whereConditions.push(`c.category = $${valueIndex++}`);
      values.push(category);
    }

    if (priority) {
      whereConditions.push(`c.priority = $${valueIndex++}`);
      values.push(priority);
    }

    if (user_id) {
      whereConditions.push(`c.user_id = $${valueIndex++}`);
      values.push(user_id);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    values.push(parseInt(limit, 10), parseInt(offset, 10));

    // Select fields based on role - hide reporter info for students and teachers
    let selectFields;
    if (user_role === 'admin') {
      selectFields = `c.*, 
                      u.username as assigned_username,
                      u.fullname as assigned_fullname,
                      approver.username as approved_by_username,
                      approver.fullname as approved_by_fullname`;
    } else {
      selectFields = `c.id, c.title, c.description, c.category, c.status, c.priority,
                      c.approval_status, c.reported_at, c.resolved_at, c.updated_at,
                      c.admin_notes, c.resolution, c.assigned_to,
                      u.username as assigned_username,
                      u.fullname as assigned_fullname`;
    }

    const query = {
      text: `SELECT ${selectFields}
             FROM complaints c
             LEFT JOIN users u ON c.assigned_to = u.id
             LEFT JOIN users approver ON c.approved_by = approver.id
             ${whereClause}
             ORDER BY c.reported_at DESC
             LIMIT $${valueIndex++} OFFSET $${valueIndex++}`,
      values,
    };

    const result = await this._pool.query(query);

    // Get images for each complaint
    const complaintsWithImages = await Promise.all(
      result.rows.map(async (complaint) => {
        const imagesQuery = {
          text: 'SELECT * FROM complaint_images WHERE complaint_id = $1 ORDER BY uploaded_at',
          values: [complaint.id],
        };
        const imagesResult = await this._pool.query(imagesQuery);

        return {
          ...complaint,
          images: imagesResult.rows,
        };
      })
    );

    return complaintsWithImages;
  }

  async getComplaintById(id) {
    const query = {
      text: `SELECT c.*, 
                    u.username as assigned_username,
                    u.fullname as assigned_fullname,
                    reporter.username as reporter_username,
                    reporter.fullname as reporter_fullname
             FROM complaints c
             LEFT JOIN users u ON c.assigned_to = u.id
             LEFT JOIN users reporter ON c.user_id = reporter.id
             WHERE c.id = $1`,
      values: [id], // Keep as is, could be string or number
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Pengaduan tidak ditemukan');
    }

    return result.rows[0];
  }

  async updateComplaintStatus(
    id,
    status,
    assigned_to = null,
    handled_by = null
  ) {
    await this.getComplaintById(id); // Check if exists

    const updates = [`status = $2`, `updated_at = NOW()`];
    const values = [id, status]; // Keep id as is
    let valueIndex = 3;

    if (assigned_to) {
      updates.push(`assigned_to = $${valueIndex++}`);
      values.push(assigned_to); // Keep as string since it's VARCHAR(50)
    }

    if (handled_by) {
      updates.push(`handled_by = $${valueIndex++}`);
      values.push(handled_by); // Keep as string since users.id is VARCHAR(50)
    }

    if (status === 'resolved') {
      updates.push(`resolved_at = NOW()`);
    }

    const query = {
      text: `UPDATE complaints SET ${updates.join(', ')} WHERE id = $1`,
      values,
    };

    await this._pool.query(query);
  }

  async addComplaintResponse(
    complaint_id,
    responder_id,
    response_text,
    is_internal = false
  ) {
    const id = `response-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO complaint_responses 
             (id, complaint_id, responder_id, response_text, is_internal, created_at)
             VALUES($1, $2, $3, $4, $5, NOW()) 
             RETURNING id`,
      values: [
        id,
        parseInt(complaint_id, 10), // Keep as int since complaints.id is serial
        responder_id, // Keep as string since users.id is VARCHAR(50)
        response_text,
        is_internal,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Respon gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getComplaintResponses(complaint_id) {
    const query = {
      text: `SELECT cr.*, 
                    u.username as responder_username,
                    u.fullname as responder_fullname,
                    u.role as responder_role
             FROM complaint_responses cr
             LEFT JOIN users u ON cr.responder_id = u.id
             WHERE cr.complaint_id = $1
             ORDER BY cr.created_at ASC`,
      values: [parseInt(complaint_id, 10)],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteComplaint(id) {
    await this.getComplaintById(id); // Check if exists

    // Delete responses first (if any)
    await this._pool.query({
      text: 'DELETE FROM complaint_responses WHERE complaint_id = $1',
      values: [id],
    });

    // Delete complaint
    const query = {
      text: 'DELETE FROM complaints WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getComplaintStatistics() {
    const stats = {};

    // Count by status
    const statusQuery = await this._pool.query(`
      SELECT status, COUNT(*) as count 
      FROM complaints 
      GROUP BY status
    `);

    stats.byStatus = {};
    statusQuery.rows.forEach((row) => {
      stats.byStatus[row.status] = parseInt(row.count);
    });

    // Count by category
    const categoryQuery = await this._pool.query(`
      SELECT category, COUNT(*) as count 
      FROM complaints 
      GROUP BY category
    `);

    stats.byCategory = {};
    categoryQuery.rows.forEach((row) => {
      stats.byCategory[row.category] = parseInt(row.count);
    });

    // Count by priority
    const priorityQuery = await this._pool.query(`
      SELECT priority, COUNT(*) as count 
      FROM complaints 
      GROUP BY priority
    `);

    stats.byPriority = {};
    priorityQuery.rows.forEach((row) => {
      stats.byPriority[row.priority] = parseInt(row.count);
    });

    // Recent complaints (last 7 days)
    const recentQuery = await this._pool.query(`
      SELECT COUNT(*) as count 
      FROM complaints 
      WHERE reported_at > NOW() - INTERVAL '7 days'
    `);

    stats.recent = parseInt(recentQuery.rows[0].count);

    // Total complaints
    const totalQuery = await this._pool.query(
      'SELECT COUNT(*) as count FROM complaints'
    );
    stats.total = parseInt(totalQuery.rows[0].count);

    return stats;
  }

  async searchComplaints(searchTerm, filters = {}) {
    let whereConditions = [];
    let values = [];
    let valueIndex = 1;

    // Add search condition
    if (searchTerm) {
      whereConditions.push(`(
        title ILIKE $${valueIndex} OR 
        description ILIKE $${valueIndex} OR 
        reporter_name ILIKE $${valueIndex}
      )`);
      values.push(`%${searchTerm}%`);
      valueIndex++;
    }

    // Add filters
    if (filters.status) {
      whereConditions.push(`status = $${valueIndex++}`);
      values.push(filters.status);
    }

    if (filters.category) {
      whereConditions.push(`category = $${valueIndex++}`);
      values.push(filters.category);
    }

    if (filters.priority) {
      whereConditions.push(`priority = $${valueIndex++}`);
      values.push(filters.priority);
    }

    if (filters.date_from) {
      whereConditions.push(`reported_at >= $${valueIndex++}`);
      values.push(filters.date_from);
    }

    if (filters.date_to) {
      whereConditions.push(`reported_at <= $${valueIndex++}`);
      values.push(filters.date_to);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    const query = {
      text: `SELECT c.*, 
                    u.username as assigned_username,
                    u.fullname as assigned_fullname
             FROM complaints c
             LEFT JOIN users u ON c.assigned_to = u.id
             ${whereClause}
             ORDER BY c.reported_at DESC
             LIMIT 100`,
      values,
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  // Legacy method compatibility
  async getComplaints(filters = {}) {
    return this.getAllComplaints(filters);
  }

  async updateComplaint(id, updateData) {
    if (updateData.status) {
      return this.updateComplaintStatus(
        id,
        updateData.status,
        updateData.assigned_to,
        updateData.handled_by
      );
    }

    // Handle other updates
    const updates = [];
    const values = [id]; // Keep id as is
    let valueIndex = 2;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && key !== 'id') {
        updates.push(`${key} = $${valueIndex++}`);
        values.push(updateData[key]);
      }
    });

    if (updates.length === 0) {
      throw new InvariantError('Tidak ada data yang diupdate');
    }

    updates.push(`updated_at = NOW()`);

    const query = {
      text: `UPDATE complaints SET ${updates.join(', ')} WHERE id = $1`,
      values,
    };

    await this._pool.query(query);
  }

  // Get complaints created by specific user
  async getComplaintsByUser(userId, filters = {}) {
    const baseFilters = { ...filters, user_id: userId };
    return this.getAllComplaints(baseFilters);
  }

  // Admin approval/rejection methods
  async approveComplaint(id, adminUserId, adminNotes = null) {
    const query = {
      text: `UPDATE complaints 
             SET approval_status = 'approved',
                 approved_by = $2,
                 approved_at = NOW(),
                 status = 'in_progress',
                 admin_notes = $3,
                 updated_at = NOW()
             WHERE id = $1`,
      values: [id, adminUserId, adminNotes],
    };

    await this._pool.query(query);
  }

  async rejectComplaint(id, adminUserId, rejectionReason) {
    const query = {
      text: `UPDATE complaints 
             SET approval_status = 'rejected',
                 approved_by = $2,
                 approved_at = NOW(),
                 status = 'rejected',
                 rejection_reason = $3,
                 updated_at = NOW()
             WHERE id = $1`,
      values: [id, adminUserId, rejectionReason],
    };

    await this._pool.query(query);
  }

  // Teacher status update methods
  async updateComplaintProgress(
    id,
    status,
    notes,
    teacherUserId,
    resolution = null
  ) {
    const allowedStatuses = ['in_progress', 'resolved'];

    if (!allowedStatuses.includes(status)) {
      throw new InvariantError('Status tidak valid');
    }

    const updates = [`status = $2`, `assigned_to = $3`, `updated_at = NOW()`];
    const values = [id, status, teacherUserId];
    let valueIndex = 4;

    if (notes) {
      updates.push(`admin_notes = $${valueIndex++}`);
      values.push(notes);
    }

    if (status === 'resolved' && resolution) {
      updates.push(`resolution = $${valueIndex++}`);
      updates.push(`resolved_at = NOW()`);
      values.push(resolution);
    }

    const query = {
      text: `UPDATE complaints SET ${updates.join(', ')} WHERE id = $1`,
      values,
    };

    await this._pool.query(query);
  }

  // Get complaints assigned to teacher
  async getAssignedComplaints(teacherId, filters = {}) {
    const baseFilters = { ...filters, assigned_to: teacherId };
    return this.getAllComplaints(baseFilters);
  }

  // Get complaint statistics
  async getComplaintStats() {
    return this.getComplaintStatistics();
  }

  // Assign complaint to user
  async assignComplaint(id, updateData) {
    return this.updateComplaint(id, updateData);
  }

  // Update complaint status
  async updateComplaintStatus(id, updateData) {
    const updates = [];
    const values = [id];
    let valueIndex = 2;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && key !== 'id') {
        updates.push(`${key} = $${valueIndex++}`);
        values.push(updateData[key]);
      }
    });

    if (updates.length === 0) {
      throw new InvariantError('Tidak ada data yang diupdate');
    }

    updates.push(`updated_at = NOW()`);

    const query = {
      text: `UPDATE complaints SET ${updates.join(', ')} WHERE id = $1`,
      values,
    };

    await this._pool.query(query);
  }
}

module.exports = ComplaintsService;
