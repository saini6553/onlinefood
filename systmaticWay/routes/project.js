const ProjectController = require('../controllers/ProjectControllers');
const project = require('../validations/Project');
const { responseCodes } = require('../utils/respSchemaHandler');

module.exports = {
  plugin: {
    async register (server, options) {
      server.route([
        {
          method: 'POST',
          path: '/',
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
            tags: ['api', 'project-save'],
            pre: [],
            validate: { payload: project.save },
            handler: ProjectController.save,
            description: 'To create a new project'
          }
        },
        {
          method: 'GET',
          path: '/',
          options: {
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
            tags: ['api', 'fetch-project'],
            pre: [],
            handler: ProjectController.fetch,
            description: 'To fetch project'
          }
        },
        {
          method: 'PATCH',
          path: '/{id}',
          options: {
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
            tags: ['api', 'update-tracking-email'],
            pre: [],
            validate: { payload: project.update },
            handler: ProjectController.update,
            description: 'To update Project'
          }
        }
      ]);
    },
    version: process.env.API_VERSION,
    name: 'project'
  }
};
