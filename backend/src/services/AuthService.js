const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoudError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class AuthService {
  constructor() {
    this._pool = new Pool();
  }

  // User Registration
  async register({ username, password, fullName, role = 'user' }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users (id, username, password, fullname, role) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, username, hashedPassword, fullName, role],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // Verify username availability
  async verifyNewUsername(username) {
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

  // Verify user credentials for login
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password, role FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword, role } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return { userId: id, role };
  }

  // Generate Access Token
  generateAccessToken(payload) {
    const tokenAge = parseInt(process.env.ACCESS_TOKEN_AGE) || 1800;
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: `${tokenAge}s`, // 30 minutes default (1800 seconds)
    });
  }

  // Generate Refresh Token
  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  }

  // Verify refresh token signature
  verifyRefreshTokenSignature(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return decoded;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  // Add refresh token to database
  async addRefreshToken(token, userId) {
    const id = `refresh-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO refresh_tokens (id, user_id, token) VALUES($1, $2, $3)',
      values: [id, userId, token],
    };

    await this._pool.query(query);
  }

  // Verify refresh token exists in database
  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM refresh_tokens WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  // Delete refresh token from database
  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM refresh_tokens WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthService;
