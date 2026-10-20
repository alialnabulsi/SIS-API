'use strict';

const AppError = require('../errors/AppError');

function notFound(request, response, next) {
  next(new AppError(404, 'ROUTE_NOT_FOUND', 'Route not found.'));
}

function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  if (error instanceof AppError) {
    const body = {
      error: {
        code: error.code,
        message: error.message,
      },
    };

    if (error.details) {
      body.error.details = error.details;
    }

    response.status(error.statusCode).json(body);
    return;
  }

  if (error.type === 'entity.parse.failed') {
    response.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Request body must contain valid JSON.',
      },
    });
    return;
  }

  if (error.type === 'entity.too.large') {
    response.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request body is too large.',
      },
    });
    return;
  }

  console.error(`Unhandled application error: ${error.message || 'Unknown error'}`);
  response.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    },
  });
}

module.exports = { errorHandler, notFound };
