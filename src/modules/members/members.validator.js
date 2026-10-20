'use strict';

const AppError = require('../../shared/errors/AppError');

const USER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,19}$/;

function validateUserId(request, response, next) {
  if (!USER_ID_PATTERN.test(request.params.userId)) {
    next(new AppError(400, 'VALIDATION_ERROR', 'Invalid SIS user ID.'));
    return;
  }

  next();
}

module.exports = { validateUserId };
