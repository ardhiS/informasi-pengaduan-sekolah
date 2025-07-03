const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoudError');

class ClassesService {
  constructor(collaborationService, activitiesService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._activitiesService = activitiesService;
  }

  async addClass({ name, subjectId, teacherId, description }) {
    const id = `class-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO classes VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, subjectId, teacherId, description],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kelas gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getClasses(userId) {
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

  async editClassById(id, { name, subjectId, description }) {
    const query = {
      text: 'UPDATE classes SET name = $1, subject_id = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id',
      values: [name, subjectId, description, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui kelas. Id tidak ditemukan');
    }
  }

  async deleteClassById(id) {
    const query = {
      text: 'DELETE FROM classes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kelas gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyClassOwner(id, userId) {
    const query = {
      text: 'SELECT * FROM classes WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kelas tidak ditemukan');
    }

    const classData = result.rows[0];
    if (classData.teacher_id !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyClassAccess(classId, userId) {
    const query = {
      text: `SELECT * FROM classes WHERE id = $1 AND (teacher_id = $2 OR id IN (
               SELECT class_id FROM class_collaborators WHERE user_id = $2
             ))`,
      values: [classId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async getClassStudents(classId) {
    // This would normally get students enrolled in the class
    // For now, we'll return empty array since we haven't implemented enrollment
    return [];
  }

  async addStudentToClass(classId, studentId, userId) {
    // Add student to class enrollment
    // Record activity
    await this._activitiesService.addActivity({
      classId,
      userId,
      action: 'add',
      targetType: 'student',
      targetName: 'Student enrollment',
    });
  }

  async removeStudentFromClass(classId, studentId, userId) {
    // Remove student from class enrollment
    // Record activity
    await this._activitiesService.addActivity({
      classId,
      userId,
      action: 'delete',
      targetType: 'student',
      targetName: 'Student enrollment',
    });
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
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ClassesService;
