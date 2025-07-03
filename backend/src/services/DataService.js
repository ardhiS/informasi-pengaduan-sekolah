const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoudError');

class DataService {
  constructor() {
    this._pool = new Pool();
  }

  // ============== SUBJECTS METHODS ==============

  async addSubject({ name, code, description }) {
    const id = `subject-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO subjects (id, name, code, description) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, code, description],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Mata pelajaran gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAllSubjects() {
    const query = {
      text: 'SELECT * FROM subjects ORDER BY name ASC',
      values: [],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSubjectById(id) {
    const query = {
      text: 'SELECT * FROM subjects WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Mata pelajaran tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSubjectById(id, { name, code, description }) {
    await this.getSubjectById(id); // Check if exists

    const updates = [];
    const values = [];
    let valueIndex = 1;

    if (name) {
      updates.push(`name = $${valueIndex++}`);
      values.push(name);
    }

    if (code) {
      updates.push(`code = $${valueIndex++}`);
      values.push(code);
    }

    if (description !== undefined) {
      updates.push(`description = $${valueIndex++}`);
      values.push(description);
    }

    if (updates.length === 0) {
      throw new InvariantError('Tidak ada data yang diupdate');
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = {
      text: `UPDATE subjects SET ${updates.join(
        ', '
      )} WHERE id = $${valueIndex}`,
      values,
    };

    await this._pool.query(query);
  }

  async deleteSubjectById(id) {
    await this.getSubjectById(id); // Check if exists

    const query = {
      text: 'DELETE FROM subjects WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  // ============== CLASSES METHODS ==============

  async addClass({ name, subjectId, teacherId, description }) {
    const id = `class-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO classes (id, name, subject_id, teacher_id, description) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, subjectId, teacherId, description],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kelas gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAllClasses() {
    const query = {
      text: `SELECT c.id, c.name, c.description, c.subject_id, c.teacher_id,
                    c.created_at, c.updated_at,
                    s.name as subject_name, s.code as subject_code, 
                    u.username as teacher_name, u.fullname as teacher_fullname
             FROM classes c 
             LEFT JOIN subjects s ON c.subject_id = s.id
             LEFT JOIN users u ON c.teacher_id = u.id
             ORDER BY c.created_at DESC`,
      values: [],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getClassesByUser(userId) {
    const query = {
      text: `SELECT c.id, c.name, c.description, c.subject_id, c.teacher_id,
                    c.created_at, c.updated_at,
                    s.name as subject_name, s.code as subject_code, 
                    u.username as teacher_name, u.fullname as teacher_fullname
             FROM classes c 
             LEFT JOIN subjects s ON c.subject_id = s.id
             LEFT JOIN users u ON c.teacher_id = u.id
             WHERE c.teacher_id = $1 
             OR c.id IN (
               SELECT class_id FROM class_collaborators WHERE user_id = $1
             )
             ORDER BY c.created_at DESC`,
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getClassById(id) {
    const query = {
      text: `SELECT c.id, c.name, c.description, c.subject_id, c.teacher_id,
                    c.created_at, c.updated_at,
                    s.name as subject_name, s.code as subject_code, 
                    u.username as teacher_name, u.fullname as teacher_fullname
             FROM classes c 
             LEFT JOIN subjects s ON c.subject_id = s.id
             LEFT JOIN users u ON c.teacher_id = u.id
             WHERE c.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kelas tidak ditemukan');
    }

    return result.rows[0];
  }

  async editClassById(id, { name, subjectId, teacherId, description }) {
    await this.getClassById(id); // Check if exists

    const updates = [];
    const values = [];
    let valueIndex = 1;

    if (name) {
      updates.push(`name = $${valueIndex++}`);
      values.push(name);
    }

    if (subjectId) {
      updates.push(`subject_id = $${valueIndex++}`);
      values.push(subjectId);
    }

    if (teacherId) {
      updates.push(`teacher_id = $${valueIndex++}`);
      values.push(teacherId);
    }

    if (description !== undefined) {
      updates.push(`description = $${valueIndex++}`);
      values.push(description);
    }

    if (updates.length === 0) {
      throw new InvariantError('Tidak ada data yang diupdate');
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = {
      text: `UPDATE classes SET ${updates.join(
        ', '
      )} WHERE id = $${valueIndex}`,
      values,
    };

    await this._pool.query(query);
  }

  async deleteClassById(id) {
    await this.getClassById(id); // Check if exists

    const query = {
      text: 'DELETE FROM classes WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  // ============== CLASS COLLABORATORS METHODS ==============

  async addClassCollaborator(classId, userId) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO class_collaborators (id, class_id, user_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, classId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborator gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getClassCollaborators(classId) {
    const query = {
      text: `SELECT cc.id, cc.class_id, cc.user_id, cc.created_at,
                    u.username, u.fullname, u.role
             FROM class_collaborators cc
             LEFT JOIN users u ON cc.user_id = u.id
             WHERE cc.class_id = $1
             ORDER BY cc.created_at DESC`,
      values: [classId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteClassCollaborator(classId, userId) {
    const query = {
      text: 'DELETE FROM class_collaborators WHERE class_id = $1 AND user_id = $2',
      values: [classId, userId],
    };

    await this._pool.query(query);
  }

  // ============== STATISTICS METHODS ==============

  async getDataStatistics() {
    const stats = {};

    // Count subjects
    const subjectsQuery = await this._pool.query(
      'SELECT COUNT(*) as count FROM subjects'
    );
    stats.subjects = parseInt(subjectsQuery.rows[0].count);

    // Count classes
    const classesQuery = await this._pool.query(
      'SELECT COUNT(*) as count FROM classes'
    );
    stats.classes = parseInt(classesQuery.rows[0].count);

    // Count users by role
    const usersQuery = await this._pool.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);

    stats.users = {};
    usersQuery.rows.forEach((row) => {
      stats.users[row.role] = parseInt(row.count);
    });

    return stats;
  }
}

module.exports = DataService;
