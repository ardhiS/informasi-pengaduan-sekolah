const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoudError');

class GuruService {
  constructor() {
    this._pool = new Pool();
  }

  async addGuru({ nama, nip, mapel }) {
    const id = `guru-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO guru VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, nama, nip, mapel],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Guru gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getGuruById(id) {
    const query = {
      text: 'SELECT * FROM guru WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Guru tidak ditemukan');
    }
    return result.rows[0];
  }

  async getAllGuru() {
    const result = await this._pool.query('SELECT * FROM guru');
    return result.rows;
  }

  async editGuruById(id, { nama, nip, mapel }) {
    const query = {
      text: 'UPDATE guru SET nama = $1, nip = $2, mapel = $3 WHERE id = $4 RETURNING id',
      values: [nama, nip, mapel, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui guru. Id tidak ditemukan');
    }
  }

  async deleteGuruById(id) {
    const query = {
      text: 'DELETE FROM guru WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Guru gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = GuruService;
