const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoudError');

class SiswaService {
  constructor() {
    this._pool = new Pool();
  }

  async addSiswa({ nama, nis, kelas }) {
    const id = `siswa-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO siswa VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, nama, nis, kelas],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Siswa gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSiswaById(id) {
    const query = {
      text: 'SELECT * FROM siswa WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Siswa tidak ditemukan');
    }
    return result.rows[0];
  }

  async getAllSiswa() {
    const result = await this._pool.query('SELECT * FROM siswa');
    return result.rows;
  }

  async editSiswaById(id, { nama, nis, kelas }) {
    const query = {
      text: 'UPDATE siswa SET nama = $1, nis = $2, kelas = $3 WHERE id = $4 RETURNING id',
      values: [nama, nis, kelas, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui siswa. Id tidak ditemukan');
    }
  }

  async deleteSiswaById(id) {
    const query = {
      text: 'DELETE FROM siswa WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Siswa gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SiswaService;
