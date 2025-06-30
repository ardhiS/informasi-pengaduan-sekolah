const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoudError');

class SubjectsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSubject({ name, code, description }) {
    const id = `subject-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO subjects VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, code, description],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Mata pelajaran gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSubjects() {
    const result = await this._pool.query(
      'SELECT id, name, code, description, created_at, updated_at FROM subjects ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async getAllSubjects() {
    const result = await this._pool.query(
      'SELECT id, name, code, description, created_at, updated_at FROM subjects ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async getSubjectById(id) {
    const query = {
      text: 'SELECT id, name, code, description, created_at, updated_at FROM subjects WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Mata pelajaran tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSubjectById(id, { name, code, description }) {
    const query = {
      text: 'UPDATE subjects SET name = $1, code = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id',
      values: [name, code, description, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal memperbarui mata pelajaran. Id tidak ditemukan'
      );
    }
  }

  async deleteSubjectById(id) {
    const query = {
      text: 'DELETE FROM subjects WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Mata pelajaran gagal dihapus. Id tidak ditemukan'
      );
    }
  }
}

module.exports = SubjectsService;
