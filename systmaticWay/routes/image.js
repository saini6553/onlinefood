const ImageController = require('../controllers/ImageController');
const { responseCodes } = require('../utils/respSchemaHandler');
const imageValidation = require('../validations/image');

module.exports = {
  plugin: {
    async register (server, options) {
      server.route([
        {
          path: '/s3upload',
          method: 'POST',
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
            payload: {
              maxBytes: 209715200,
              output: 'file',
              parse: true,
              multipart: true
            },
            validate: { payload: imageValidation.upload },
            handler: ImageController.uploadOnS3
          }
        }
      ]);
    },
    version: process.env.API_VERSION,
    name: 'ImageUpload'
  }
};
