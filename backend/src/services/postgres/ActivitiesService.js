const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addActivity({ classId, userId, action, targetType, targetName }) {
    const id = `activity-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO class_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, classId, userId, action, targetType, targetName],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getClassActivities(classId) {
    const query = {
      text: `SELECT ca.action, ca.target_type, ca.target_name, ca.created_at as time, u.username
             FROM class_activities ca
             LEFT JOIN users u ON ca.user_id = u.id
             WHERE ca.class_id = $1
             ORDER BY ca.created_at DESC`,
      values: [classId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ActivitiesService;
