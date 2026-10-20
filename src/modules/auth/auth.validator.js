'use strict';

const AppError = require('../../shared/errors/AppError');

const USER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,19}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(request, response, next) {
  const body = request.body;
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    next(new AppError(400, 'VALIDATION_ERROR', 'Invalid request body.'));
    return;
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !['identifier', 'password'].includes(field)
  );

  if (unknownFields.length > 0) {
    errors.push(`Unknown fields: ${unknownFields.join(', ')}`);
  }

  const identifier = typeof body.identifier === 'string'
    ? body.identifier.trim()
    : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const validIdentifier = USER_ID_PATTERN.test(identifier) ||
    (identifier.length <= 254 && EMAIL_PATTERN.test(identifier));

  if (!validIdentifier) {
    errors.push('identifier must be a valid SIS user ID or official email.');
  }

  if (password.length < 1 || password.length > 1024) {
    errors.push('password must be between 1 and 1024 characters.');
  }

  if (errors.length > 0) {
    next(new AppError(400, 'VALIDATION_ERROR', 'Invalid request body.', errors));
    return;
  }

  request.validatedBody = { identifier, password };
  next();
}

module.exports = { validateCredentials };
