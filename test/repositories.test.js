'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');

const { createAuthRepository } = require('../src/modules/auth/auth.repository');
const { createMembersRepository } = require('../src/modules/members/members.repository');

test('auth lookup is parameterized and compares email case-insensitively', async () => {
  const calls = [];
  const repository = createAuthRepository(async (text, parameters) => {
    calls.push({ text, parameters });
    return { rows: [] };
  });

  await repository.findByIdentifier('Student@Example.Invalid');

  assert.match(calls[0].text, /lower\(email\) = lower\(\$1\)/);
  assert.deepEqual(calls[0].parameters, ['Student@Example.Invalid']);
  assert.equal(calls[0].text.includes('Student@Example.Invalid'), false);
});

test('last-login update is parameterized', async () => {
  const calls = [];
  const repository = createAuthRepository(async (text, parameters) => {
    calls.push({ text, parameters });
    return { rows: [{ last_login_at: '2026-10-20T00:00:00Z' }] };
  });

  const timestamp = await repository.updateLastLogin('DEVSTU001');

  assert.match(calls[0].text, /WHERE user_id = \$1/);
  assert.deepEqual(calls[0].parameters, ['DEVSTU001']);
  assert.equal(timestamp, '2026-10-20T00:00:00Z');
});

test('all member repository lookups parameterize the user ID', async () => {
  const calls = [];
  const repository = createMembersRepository(async (text, parameters) => {
    calls.push({ text, parameters });
    return { rows: [] };
  });

  await Promise.all([
    repository.findUserById('DEVSTU001'),
    repository.findRoles('DEVSTU001'),
    repository.findStudent('DEVSTU001'),
    repository.findStudentPrograms('DEVSTU001'),
    repository.findInstructor('DEVSTU001'),
    repository.findAdvisor('DEVSTU001'),
  ]);

  assert.equal(calls.length, 6);
  for (const call of calls) {
    assert.match(call.text, /\$1/);
    assert.deepEqual(call.parameters, ['DEVSTU001']);
    assert.equal(call.text.includes('DEVSTU001'), false);
  }
});
