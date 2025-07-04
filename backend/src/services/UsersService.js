const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class UsersService {
  constructor(pool) {
    this._pool = pool || new Pool();
  }

  // Unified user management for all roles
  async getUsers({ role = null, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM users';
    const params = [];

    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }

    query +=
      ' ORDER BY created_at DESC LIMIT $' +
      (params.length + 1) +
      ' OFFSET $' +
      (params.length + 2);
    params.push(limit, offset);

    const result = await this._pool.query(query, params);

    // Remove passwords from all users
    return result.rows.map((user) => {
      delete user.password;
      return user;
    });
  }

  async addUser(userData) {
    const { username, password, fullName, role } = userData;

    // Check if username already exists
    await this.verifyUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (id, username, password, fullname, role, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id
    `;

    const id = nanoid();
    const values = [id, username, hashedPassword, fullName, role, new Date()];
    const result = await this._pool.query(query, values);

    return result.rows[0].id;
  }

  // Verify username availability
  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.'
      );
    }
  }

  // Get user by ID
  async getUserById(userId) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const user = result.rows[0];

    // Remove password from response
    delete user.password;

    return user;
  }

  async editUser(id, userData) {
    const { fullName, role } = userData;

    const query = `
      UPDATE users 
      SET fullname = $1, role = $2, updated_at = $3 
      WHERE id = $4
    `;

    const values = [fullName, role, new Date(), id];
    await this._pool.query(query, values);
  }

  async deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await this._pool.query(query, [id]);
  }

  async getUserStats() {
    const query = `
      SELECT 
        role,
        COUNT(*) as count
      FROM users 
      GROUP BY role
    `;

    const result = await this._pool.query(query);
    return result.rows;
  }

  // Get user by username (for authentication)
  async getUserByUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  // Legacy compatibility methods
  async getAllUsers(role = null) {
    return this.getUsers({ role });
  }

  async editUserById(userId, userData) {
    return this.editUser(userId, userData);
  }

  async deleteUserById(userId) {
    return this.deleteUser(userId);
  }
}

module.exports = UsersService;
