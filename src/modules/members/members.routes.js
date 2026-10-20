'use strict';

const express = require('express');

const membersController = require('./members.controller');
const { validateUserId } = require('./members.validator');
const serviceAuth = require('../../shared/middleware/serviceAuth');

function createMembersRouter(options = {}) {
  const router = express.Router();
  const controller = options.controller || membersController;
  const authenticateService = options.serviceAuth || serviceAuth;

  router.get('/:userId', authenticateService, validateUserId, controller.getByUserId);

  return router;
}

module.exports = createMembersRouter();
module.exports.createMembersRouter = createMembersRouter;
