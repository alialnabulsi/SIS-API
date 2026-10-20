'use strict';

const { query } = require('../../config/database');

function createAuthRepository(databaseQuery = query) {
  return {
    async findByIdentifier(identifier) {
      const result = await databaseQuery(
        `SELECT user_id, account_status, password_hash
         FROM sis_user
         WHERE user_id = $1 OR lower(email) = lower($1)
         LIMIT 1`,
        [identifier]
      );

      return result.rows[0] || null;
    },

    async updateLastLogin(userId) {
      const result = await databaseQuery(
        `UPDATE sis_user
         SET last_login_at = now()
         WHERE user_id = $1
         RETURNING last_login_at`,
        [userId]
      );

      return result.rows[0]?.last_login_at || null;
    },
  };
}

module.exports = createAuthRepository();
module.exports.createAuthRepository = createAuthRepository;
