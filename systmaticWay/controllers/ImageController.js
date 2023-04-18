const Boom = require('@hapi/boom');
const { isEmpty, has, includes } = require('lodash');
const ImageService = require('../services/ImageService');
const imageService = new ImageService();

class ImageController {
  /**
   * uploadOnS3
   * compress image and upload on S3
   * @param {Hapi request obj} request
   * @param {hapi handler} h
   */
  static async uploadOnS3 (request, h) {
    try {
      request.logger.info('ImageController:uploadOnS3 method called!');
      if (!has(request.payload, 'file') || isEmpty(request.payload.file)) {
        return Boom.badRequest('file is required and must be an object.');
      }
      const { file, namespace } = request.payload;

      // check for file extension
      const allowedFileTypes = process.env.ALLOWED_FILE_TYPE.split(',');
      const extension = file.filename.split('.').pop();
      if (!includes(allowedFileTypes, extension)) {
        return Boom.badRequest(`Only ${allowedFileTypes} files are allowed.`);
      }

      const uploadedFile = await imageService.imageCompressAndUpload(file, namespace);
      request.logger.info(
        `ImageController:uploadOnS3 compressed and uploaded successfully - ${JSON.stringify(uploadedFile)}`
      );
      return h
        .response({
          statusCode: 200,
          message: 'Image compressed and uploaded successfully on S3',
          data: uploadedFile
        })
        .code(200);
    } catch (err) {
      request.logger.error(`ImageController:uploadOnS3: ${err} ${err.stack}`);
      if (Boom.isBoom(err)) {
        throw err;
      } else {
        throw new Boom.Boom(err, { statusCode: 500 });
      }
    }
  }
}

module.exports = ImageController;
