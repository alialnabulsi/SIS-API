'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { createAuthService } = require('../src/modules/auth/auth.service');

const BCRYPT_HASH = `$2b$12$${'a'.repeat(53)}`;
const MEMBER = {
  userId: 'DEVSTU001',
  email: 'dev.student@example.invalid',
  firstName: 'Dev',
  lastName: 'Student',
  roles: ['student'],
  student: null,
  instructor: null,
  advisor: null,
};

function buildService(overrides = {}) {
  const calls = [];
  const user = overrides.user === undefined
    ? {
        user_id: 'DEVSTU001',
        account_status: 'active',
        password_hash: BCRYPT_HASH,
      }
    : overrides.user;
  const repository = {
    async findByIdentifier(identifier) {
      calls.push(['find', identifier]);
      return user;
    },
    async updateLastLogin(userId) {
      calls.push(['update', userId]);
      return new Date();
    },
  };
  const memberService = {
    async getByUserId(userId, options) {
      calls.push(['member', userId, options]);
      return MEMBER;
    },
  };
  const service = createAuthService({
    repository,
    memberService,
    comparePassword: overrides.comparePassword || (async (password) => password === 'correct'),
    getDummyHash: async () => BCRYPT_HASH,
  });

  return { calls, service };
}

test('verifies a valid SIS ID and updates last_login_at after member loading', async () => {
  const { calls, service } = buildService();
  const result = await service.verifyCredentials('DEVSTU001', 'correct');

  assert.deepEqual(result, MEMBER);
  assert.deepEqual(calls, [
    ['find', 'DEVSTU001'],
    ['member', 'DEVSTU001', { includeAccountStatus: false }],
    ['update', 'DEVSTU001'],
  ]);
  assert.equal(JSON.stringify(result).includes('password'), false);
});

test('accepts an email identifier without changing its case', async () => {
  const { calls, service } = buildService();

  await service.verifyCredentials('Dev.Student@Example.Invalid', 'correct');

  assert.deepEqual(calls[0], ['find', 'Dev.Student@Example.Invalid']);
});

test('returns a generic failure for a wrong password', async () => {
  const { calls, service } = buildService();

  await assert.rejects(
    service.verifyCredentials('DEVSTU001', 'wrong'),
    (error) => error.statusCode === 401 && error.code === 'INVALID_CREDENTIALS'
  );
  assert.deepEqual(calls, [['find', 'DEVSTU001']]);
});

test('returns the same generic failure for an unknown user', async () => {
  let compareCalled = false;
  const { service } = buildService({
    user: null,
    comparePassword: async () => {
      compareCalled = true;
      return false;
    },
  });

  await assert.rejects(
    service.verifyCredentials('UNKNOWN001', 'wrong'),
    (error) => error.statusCode === 401 && error.message === 'Invalid SIS credentials.'
  );
  assert.equal(compareCalled, true);
});

for (const status of ['inactive', 'suspended']) {
  const article = status === 'inactive' ? 'an' : 'a';

  test(`rejects ${article} ${status} account with the generic failure`, async () => {
    const { calls, service } = buildService({
      user: {
        user_id: 'DEVSTU001',
        account_status: status,
        password_hash: BCRYPT_HASH,
      },
    });

    await assert.rejects(
      service.verifyCredentials('DEVSTU001', 'correct'),
      (error) => error.statusCode === 401 && error.code === 'INVALID_CREDENTIALS'
    );
    assert.deepEqual(calls, [['find', 'DEVSTU001']]);
  });
}

test('never treats a plaintext password_hash value as valid', async () => {
  let compareCalled = false;
  const { service } = buildService({
    user: {
      user_id: 'DEVSTU001',
      account_status: 'active',
      password_hash: 'correct',
    },
    comparePassword: async () => {
      compareCalled = true;
      return true;
    },
  });

  await assert.rejects(
    service.verifyCredentials('DEVSTU001', 'correct'),
    (error) => error.code === 'INVALID_CREDENTIALS'
  );
  assert.equal(compareCalled, false);
});
