'use strict';

const express = require('express');

const authController = require('./auth.controller');
const { validateCredentials } = require('./auth.validator');
const serviceAuth = require('../../shared/middleware/serviceAuth');
const { createCredentialRateLimit } = require('../../shared/middleware/credentialRateLimit');

function createAuthRouter(options = {}) {
  const router = express.Router();
  const controller = options.controller || authController;
  const authenticateService = options.serviceAuth || serviceAuth;
  const rateLimit = options.rateLimit || createCredentialRateLimit();

  router.post(
    '/verify',
    authenticateService,
    rateLimit,
    validateCredentials,
    controller.verify
  );

  return router;
}

module.exports = createAuthRouter();
module.exports.createAuthRouter = createAuthRouter;
