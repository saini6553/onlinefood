const { responseCodes } = require('../utils/respSchemaHandler');
const UserController = require('../controllers/UserController');
const UserValidation = require('../validations/user');

module.exports = {
  plugin: {
    async register (server, options) {
      server.route([
        {
          method: 'POST',
          path: '/userPasswordLogin',
          options: {
            auth: false,
            plugins: {
              'hapi-swagger': {
                security: [
                  {
                    AUTH0_TOKEN: []
                  }
                ],
                responses: responseCodes([200, 400, 401, 404, 500])
              }
            },
            tags: ['api', 'V1 Auth'],
            pre: [],
            validate: { payload: UserValidation.login },
            handler: UserController.login,
            description: 'Verify user credential and get token to access APIs'
          }
        },
        {
          method: 'POST',
          path: '/userPasswordSignup',
          options: {
            auth: false,
            plugins: {
              'hapi-swagger': {
                security: [
                  {
                    AUTH0_TOKEN: []
                  }
                ],
                responses: responseCodes([200, 400, 401, 404, 500])
              }
            },
            tags: ['api', 'V1 Auth'],
            pre: [],
            validate: { payload: UserValidation.signup },
            handler: UserController.signup,
            description: 'Register a user'
          }
        }
      ]);
    },
    version: process.env.API_VERSION,
    name: 'user'
  }
};
