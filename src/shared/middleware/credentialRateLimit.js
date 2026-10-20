'use strict';

const { createHash } = require('crypto');

const AppError = require('../errors/AppError');

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 10;

function readPositiveInteger(value, fallback, name) {
  if (value === undefined || value === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return parsed;
}

function createCredentialRateLimit(options = {}) {
  const windowMs = options.windowMs || readPositiveInteger(
    process.env.AUTH_RATE_LIMIT_WINDOW_MS,
    DEFAULT_WINDOW_MS,
    'AUTH_RATE_LIMIT_WINDOW_MS'
  );
  const maxAttempts = options.maxAttempts || readPositiveInteger(
    process.env.AUTH_RATE_LIMIT_MAX_ATTEMPTS,
    DEFAULT_MAX_ATTEMPTS,
    'AUTH_RATE_LIMIT_MAX_ATTEMPTS'
  );
  const now = options.now || Date.now;
  const attempts = new Map();

  return function credentialRateLimit(request, response, next) {
    const currentTime = now();

    for (const [key, record] of attempts) {
      if (record.resetAt <= currentTime) {
        attempts.delete(key);
      }
    }

    const identifier = typeof request.body?.identifier === 'string'
      ? request.body.identifier.trim().toLowerCase()
      : '';
    const key = createHash('sha256')
      .update(`${request.ip}|${identifier}`)
      .digest('hex');
    const record = attempts.get(key) || {
      count: 0,
      resetAt: currentTime + windowMs,
    };

    if (record.count >= maxAttempts) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((record.resetAt - currentTime) / 1000)
      );
      response.set('Retry-After', String(retryAfterSeconds));
      next(
        new AppError(
          429,
          'AUTH_RATE_LIMITED',
          'Too many credential verification attempts. Try again later.'
        )
      );
      return;
    }

    record.count += 1;
    attempts.set(key, record);

    response.once('finish', () => {
      if (response.statusCode < 400) {
        attempts.delete(key);
      }
    });

    next();
  };
}

module.exports = { createCredentialRateLimit };
