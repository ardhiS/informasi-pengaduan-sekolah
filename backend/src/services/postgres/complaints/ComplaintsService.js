const { Pool } = require('pg');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoudError');

class ComplaintsService {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || 'developer',
      password: process.env.PGPASSWORD || 'supersecretpassword',
      database: process.env.PGDATABASE || 'notesapp',
    });
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
  }) {
    const query = {
      text: `INSERT INTO complaints 
             (title, description, category, reporter_name, reporter_email, 
              reporter_phone, reporter_type, reporter_class, priority, status, 
              reported_at) 
             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) 
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
        'pending',
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Complaint gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getComplaints({
    status,
    category,
    priority,
    limit = 50,
    offset = 0,
  } = {}) {
    let query = `
      SELECT c.*
      FROM complaints c
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND c.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (category) {
      query += ` AND c.category = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }

    if (priority) {
      query += ` AND c.priority = $${paramIndex}`;
      values.push(priority);
      paramIndex++;
    }

    query += ` ORDER BY c.reported_at DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`;
    values.push(limit, offset);

    const result = await this._pool.query({ text: query, values });
    return result.rows;
  }

  async getComplaintById(id) {
    const query = {
      text: `SELECT c.*, u.fullname as assigned_admin_name
             FROM complaints c
             LEFT JOIN users u ON c.assigned_to = u.id
             WHERE c.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Complaint tidak ditemukan');
    }

    return result.rows[0];
  }

  async updateComplaint(
    id,
    {
      title,
      description,
      category,
      status,
      priority,
      assigned_to,
      admin_notes,
      resolution,
    }
  ) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) {
      fields.push(`title = $${paramIndex}`);
      values.push(title);
      paramIndex++;
    }

    if (description !== undefined) {
      fields.push(`description = $${paramIndex}`);
      values.push(description);
      paramIndex++;
    }

    if (category !== undefined) {
      fields.push(`category = $${paramIndex}`);
      values.push(category);
      paramIndex++;
    }

    if (status !== undefined) {
      fields.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;

      // If status is resolved or closed, set resolved_at
      if (status === 'resolved' || status === 'closed') {
        fields.push(`resolved_at = NOW()`);
      }
    }

    if (priority !== undefined) {
      fields.push(`priority = $${paramIndex}`);
      values.push(priority);
      paramIndex++;
    }

    if (assigned_to !== undefined) {
      fields.push(`assigned_to = $${paramIndex}`);
      values.push(assigned_to);
      paramIndex++;
    }

    if (admin_notes !== undefined) {
      fields.push(`admin_notes = $${paramIndex}`);
      values.push(admin_notes);
      paramIndex++;
    }

    if (resolution !== undefined) {
      fields.push(`resolution = $${paramIndex}`);
      values.push(resolution);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new InvariantError('Tidak ada field yang diupdate');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const query = {
      text: `UPDATE complaints SET ${fields.join(
        ', '
      )} WHERE id = $${paramIndex} RETURNING id`,
      values,
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Complaint tidak ditemukan');
    }
  }

  async deleteComplaint(id) {
    const query = {
      text: 'DELETE FROM complaints WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Complaint tidak ditemukan');
    }
  }

  async getComplaintStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed,
        COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent,
        COUNT(CASE WHEN priority = 'high' THEN 1 END) as high,
        COUNT(CASE WHEN priority = 'medium' THEN 1 END) as medium,
        COUNT(CASE WHEN priority = 'low' THEN 1 END) as low,
        COUNT(CASE WHEN category = 'akademik' THEN 1 END) as akademik,
        COUNT(CASE WHEN category = 'fasilitas' THEN 1 END) as fasilitas,
        COUNT(CASE WHEN category = 'bullying' THEN 1 END) as bullying,
        COUNT(CASE WHEN category = 'lainnya' THEN 1 END) as lainnya,
        COUNT(CASE WHEN reporter_type = 'siswa' THEN 1 END) as from_siswa,
        COUNT(CASE WHEN reporter_type = 'guru' THEN 1 END) as from_guru,
        COUNT(CASE WHEN reporter_type = 'orangtua' THEN 1 END) as from_orangtua,
        COUNT(CASE WHEN reporter_type = 'admin' THEN 1 END) as from_admin
      FROM complaints
    `;

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  // Get complaints (since we don't have created_by column, return all with filters)
  async getComplaintsByUser(
    userId,
    { status, category, priority, limit = 50, offset = 0 }
  ) {
    // Since the table doesn't have created_by column, return all complaints with filters
    // This maintains API compatibility while working with current table structure
    return this.getComplaints({ status, category, priority, limit, offset });
  }

  // Get complaints assigned to specific user
  async getAssignedComplaints(
    userId,
    { status, category, priority, limit, offset }
  ) {
    let whereClause = 'WHERE assigned_to = $1';
    const values = [userId];
    let paramCount = 1;

    if (status) {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      values.push(status);
    }

    if (category) {
      paramCount++;
      whereClause += ` AND category = $${paramCount}`;
      values.push(category);
    }

    if (priority) {
      paramCount++;
      whereClause += ` AND priority = $${paramCount}`;
      values.push(priority);
    }

    let limitClause = '';
    if (limit) {
      paramCount++;
      limitClause += ` LIMIT $${paramCount}`;
      values.push(limit);
    }

    if (offset) {
      paramCount++;
      limitClause += ` OFFSET $${paramCount}`;
      values.push(offset);
    }

    const query = `
      SELECT * FROM complaints 
      ${whereClause}
      ORDER BY reported_at DESC
      ${limitClause}
    `;

    const result = await this._pool.query(query, values);
    return result.rows;
  }

  // Update complaint status specifically
  async updateComplaintStatus(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
      }
    });

    if (fields.length === 0) {
      throw new InvariantError('Tidak ada data yang akan diupdate');
    }

    paramCount++;
    values.push(id);

    const query = {
      text: `UPDATE complaints SET ${fields.join(
        ', '
      )} WHERE id = $${paramCount}`,
      values,
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Complaint tidak ditemukan');
    }
  }

  // Assign complaint to user
  async assignComplaint(id, assignData) {
    const fields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(assignData).forEach((key) => {
      if (assignData[key] !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(assignData[key]);
      }
    });

    if (fields.length === 0) {
      throw new InvariantError('Tidak ada data assignment yang akan diupdate');
    }

    paramCount++;
    values.push(id);

    const query = {
      text: `UPDATE complaints SET ${fields.join(
        ', '
      )} WHERE id = $${paramCount}`,
      values,
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Complaint tidak ditemukan');
    }
  }
}

module.exports = ComplaintsService;
