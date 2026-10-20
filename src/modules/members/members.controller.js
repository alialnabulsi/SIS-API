'use strict';

const membersService = require('./members.service');

function createMembersController(service = membersService) {
  return {
    async getByUserId(request, response, next) {
      try {
        const member = await service.getByUserId(request.params.userId, {
          includeAccountStatus: true,
        });

        response.set('Cache-Control', 'no-store');
        response.status(200).json({ data: member });
      } catch (error) {
        next(error);
      }
    },
  };
}

module.exports = createMembersController();
module.exports.createMembersController = createMembersController;
