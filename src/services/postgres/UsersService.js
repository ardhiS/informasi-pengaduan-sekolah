const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoudError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname, role = 'siswa' }) {
    await this.verifyUsername(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users (id, username, password, fullname, role) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, username, hashedPassword, fullname, role],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new NotFoundError(
        'Gagal menambahkan user. Username sudah digunakan.'
      );
    }
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname, role, created_at FROM users WHERE id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

  async getUsers() {
    const query = {
      text: 'SELECT id, username, fullname, role, created_at FROM users ORDER BY created_at DESC',
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async editUserById(id, { username, password, fullname, role }) {
    // Jika username berubah, cek apakah username baru sudah ada
    if (username) {
      const currentUser = await this.getUserById(id);
      if (currentUser.username !== username) {
        await this.verifyUsername(username);
      }
    }

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const query = {
      text: `UPDATE users SET 
        username = COALESCE($2, username),
        password = COALESCE($3, password),
        fullname = COALESCE($4, fullname),
        role = COALESCE($5, role)
        WHERE id = $1`,
      values: [id, username, hashedPassword, fullname, role],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui user. Id tidak ditemukan');
    }
  }

  async deleteUserById(id) {
    const query = {
      text: 'DELETE FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('User gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = UsersService;
