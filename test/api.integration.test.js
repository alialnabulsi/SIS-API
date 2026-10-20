'use strict';

const assert = require('node:assert/strict');
const { once } = require('node:events');
const { test } = require('node:test');
const express = require('express');

const { createAuthController } = require('../src/modules/auth/auth.controller');
const { createAuthRouter } = require('../src/modules/auth/auth.routes');
const { createMembersController } = require('../src/modules/members/members.controller');
const { createMembersRouter } = require('../src/modules/members/members.routes');
const { getServiceApiKey } = require('../src/config/serviceAuth');
const AppError = require('../src/shared/errors/AppError');
const { createCredentialRateLimit } = require('../src/shared/middleware/credentialRateLimit');
const { errorHandler, notFound } = require('../src/shared/middleware/errorHandler');

const API_KEY = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFG';
const noopRateLimit = (request, response, next) => next();

process.env.SIS_SERVICE_API_KEY = API_KEY;

test('service key validation rejects short and low-diversity values', () => {
  assert.throws(() => getServiceApiKey({ SIS_SERVICE_API_KEY: 'too-short' }));
  assert.throws(() => getServiceApiKey({ SIS_SERVICE_API_KEY: 'A'.repeat(43) }));
  assert.equal(getServiceApiKey({ SIS_SERVICE_API_KEY: API_KEY }), API_KEY);
});

function buildApp(options = {}) {
  const app = express();
  const authService = options.authService || {
    async verifyCredentials(identifier) {
      return {
        userId: 'DEVSTU001',
        email: 'dev.student@example.invalid',
        firstName: 'Dev',
        lastName: 'Student',
        roles: ['student'],
        student: null,
        instructor: null,
        advisor: null,
        receivedIdentifier: identifier,
      };
    },
  };
  const membersService = options.membersService || {
    async getByUserId(userId) {
      return {
        userId,
        email: 'dev.student@example.invalid',
        firstName: 'Dev',
        lastName: 'Student',
        accountStatus: 'active',
        roles: ['student'],
        student: null,
        instructor: null,
        advisor: null,
      };
    },
  };

  app.use(express.json({ limit: '16kb', strict: true }));
  app.use('/api/v1/auth', createAuthRouter({
    controller: createAuthController(authService),
    rateLimit: options.rateLimit || noopRateLimit,
  }));
  app.use('/api/v1/members', createMembersRouter({
    controller: createMembersController(membersService),
  }));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

async function request(app, path, options = {}) {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();

  try {
    return await fetch(`http://127.0.0.1:${port}${path}`, options);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

function authorizedHeaders() {
  return {
    authorization: `Bearer ${API_KEY}`,
    'content-type': 'application/json',
  };
}

test('POST /api/v1/auth/verify returns a sanitized member response', async () => {
  const response = await request(buildApp(), '/api/v1/auth/verify', {
    method: 'POST',
    headers: authorizedHeaders(),
    body: JSON.stringify({ identifier: 'DEVSTU001', password: 'correct' }),
  });
  const body = await response.json();
  const serialized = JSON.stringify(body);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(body.data.userId, 'DEVSTU001');
  assert.equal(serialized.includes('password'), false);
  assert.equal(serialized.includes(API_KEY), false);
});

test('credential verification accepts a syntactically valid official email', async () => {
  let receivedIdentifier;
  const app = buildApp({
    authService: {
      async verifyCredentials(identifier) {
        receivedIdentifier = identifier;
        return { userId: 'DEVSTU001', roles: [], student: null };
      },
    },
  });
  const response = await request(app, '/api/v1/auth/verify', {
    method: 'POST',
    headers: authorizedHeaders(),
    body: JSON.stringify({
      identifier: 'Dev.Student@Example.Invalid',
      password: 'correct',
    }),
  });

  assert.equal(response.status, 200);
  assert.equal(receivedIdentifier, 'Dev.Student@Example.Invalid');
});

for (const authorization of [undefined, 'Bearer wrong-service-key']) {
  test(`credential verification rejects ${authorization ? 'invalid' : 'missing'} service credentials`, async () => {
    const headers = { 'content-type': 'application/json' };

    if (authorization) {
      headers.authorization = authorization;
    }

    const response = await request(buildApp(), '/api/v1/auth/verify', {
      method: 'POST',
      headers,
      body: JSON.stringify({ identifier: 'DEVSTU001', password: 'correct' }),
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.error.code, 'SERVICE_UNAUTHORIZED');
  });
}

test('credential verification rejects unknown and malformed request fields', async () => {
  const response = await request(buildApp(), '/api/v1/auth/verify', {
    method: 'POST',
    headers: authorizedHeaders(),
    body: JSON.stringify({ identifier: '', password: '', admin: true }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, 'VALIDATION_ERROR');
  assert.ok(body.error.details.length >= 2);
});

test('credential verification rate limiter blocks repeated failures', async () => {
  const app = buildApp({
    authService: {
      async verifyCredentials() {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid SIS credentials.');
      },
    },
    rateLimit: createCredentialRateLimit({ maxAttempts: 2, windowMs: 60000 }),
  });
  const options = {
    method: 'POST',
    headers: authorizedHeaders(),
    body: JSON.stringify({ identifier: 'DEVSTU001', password: 'wrong' }),
  };

  assert.equal((await request(app, '/api/v1/auth/verify', options)).status, 401);
  assert.equal((await request(app, '/api/v1/auth/verify', options)).status, 401);
  const limitedResponse = await request(app, '/api/v1/auth/verify', options);

  assert.equal(limitedResponse.status, 429);
  assert.equal(limitedResponse.headers.has('retry-after'), true);
});

test('GET /api/v1/members/:userId returns student and multi-role data', async () => {
  const app = buildApp({
    membersService: {
      async getByUserId(userId, options) {
        return {
          userId,
          accountStatus: options.includeAccountStatus ? 'active' : undefined,
          roles: ['academic_admin', 'instructor', 'student'],
          student: {
            academicStatus: 'active',
            primaryCampus: { id: 1, code: 'MAIN', name: 'Main Campus' },
            programs: [],
          },
          instructor: { department: { code: 'CS' } },
          advisor: null,
        };
      },
    },
  });
  const response = await request(app, '/api/v1/members/DEVSTU001', {
    headers: { authorization: `Bearer ${API_KEY}` },
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body.data.roles, ['academic_admin', 'instructor', 'student']);
  assert.equal(body.data.student.primaryCampus.code, 'MAIN');
  assert.equal(body.data.instructor.department.code, 'CS');
});

test('member lookup returns 404 for an unknown member', async () => {
  const app = buildApp({
    membersService: {
      async getByUserId() {
        throw new AppError(404, 'MEMBER_NOT_FOUND', 'University member not found.');
      },
    },
  });
  const response = await request(app, '/api/v1/members/UNKNOWN001', {
    headers: { authorization: `Bearer ${API_KEY}` },
  });
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.equal(body.error.code, 'MEMBER_NOT_FOUND');
});

test('member lookup requires service credentials', async () => {
  const response = await request(buildApp(), '/api/v1/members/DEVSTU001');
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error.code, 'SERVICE_UNAUTHORIZED');
});
