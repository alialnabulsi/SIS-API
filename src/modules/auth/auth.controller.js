'use strict';

const authService = require('./auth.service');

function createAuthController(service = authService) {
  return {
    async verify(request, response, next) {
      try {
        const { identifier, password } = request.validatedBody;
        const member = await service.verifyCredentials(identifier, password);

        response.set('Cache-Control', 'no-store');
        response.status(200).json({ data: member });
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = createAuthController();
module.exports.createAuthController = createAuthController;
