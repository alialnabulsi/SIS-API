'use strict';

const { randomBytes } = require('crypto');
const bcrypt = require('bcrypt');

const authRepository = require('./auth.repository');
const membersService = require('../members/members.service');
const AppError = require('../../shared/errors/AppError');

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$.{53}$/;
const dummyHashPromise = bcrypt.hash(randomBytes(32).toString('base64url'), 12);

function invalidCredentials() {
  return new AppError(401, 'INVALID_CREDENTIALS', 'Invalid SIS credentials.');
}

function createAuthService(options = {}) {
  const repository = options.repository || authRepository;
  const memberService = options.memberService || membersService;
  const comparePassword = options.comparePassword || bcrypt.compare;
  const getDummyHash = options.getDummyHash || (() => dummyHashPromise);

  return {
    async verifyCredentials(identifier, password) {
      const user = await repository.findByIdentifier(identifier);

      if (!user) {
        await comparePassword(password, await getDummyHash());
        throw invalidCredentials();
      }

      let passwordMatches = false;

      if (BCRYPT_HASH_PATTERN.test(user.password_hash)) {
        try {
          passwordMatches = await comparePassword(password, user.password_hash);
        } catch {
          passwordMatches = false;
        }
      }

      if (!passwordMatches || user.account_status !== 'active') {
        throw invalidCredentials();
      }

      const member = await memberService.getByUserId(user.user_id, {
        includeAccountStatus: false,
      });

      await repository.updateLastLogin(user.user_id);

      return member;
    },
  };
}

module.exports = createAuthService();
module.exports.createAuthService = createAuthService;
