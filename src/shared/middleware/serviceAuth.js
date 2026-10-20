'use strict';

const { createHash, timingSafeEqual } = require('crypto');

const { getServiceApiKey } = require('../../config/serviceAuth');
const AppError = require('../errors/AppError');

function digest(value) {
  return createHash('sha256').update(value).digest();
}

function authenticationError() {
  return new AppError(
    401,
    'SERVICE_UNAUTHORIZED',
    'Missing or invalid service credentials.'
  );
}

function serviceAuth(request, response, next) {
  const authorization = request.get('authorization');
  const match = typeof authorization === 'string'
    ? authorization.match(/^Bearer ([^\s]+)$/)
    : null;

  if (!match) {
    response.set('WWW-Authenticate', 'Bearer');
    next(authenticationError());
    return;
  }

  const expectedDigest = digest(getServiceApiKey());
  const suppliedDigest = digest(match[1]);

  if (!timingSafeEqual(expectedDigest, suppliedDigest)) {
    response.set('WWW-Authenticate', 'Bearer');
    next(authenticationError());
    return;
  }

  next();
}

module.exports = serviceAuth;
