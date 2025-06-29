const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class RefreshTokenService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(userId, token) {
    const id = `refresh-token-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO refresh_tokens VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT * FROM refresh_tokens WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM refresh_tokens WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = RefreshTokenService;
