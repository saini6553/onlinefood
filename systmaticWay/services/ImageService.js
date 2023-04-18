const uuid = require('uuid');
const AWS = require('aws-sdk');
const mime = require('mime-types');
let sharp = require('sharp');
const isTestMode = process.env.NODE_ENV === 'testing';
sharp.cache({ files: 0 });

class ImageService {
  /**
   * This method is responsible for compress with the help of sharp module
   * All option is get from .env file
   * @param {File obj} file
   * @param {String} namespace directory inside bucket
   */
  async imageCompressAndUpload (file, namespace) {
    global.logger.info('ImageService:imageCompressAndUpload method called!');

    // Mock sharp function according to its used in test mode /;
    if (isTestMode) {
      sharp = jest.fn().mockImplementation(() => ({
        resize: jest.fn().mockReturnThis(),
        jpeg: jest.fn().mockReturnThis(),
        png: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockReturnThis()
      }));
    }

    // Setting resizing configuration according to params
    const resize = {
      width: 768,
      height: 320
    };
    // Resize and compress image /
    global.logger.info(
      `ImageService:imageCompressAndUpload resize and compress file ${file.filename}`
    );
    const modeFile = await sharp(file.path)
      .resize(resize)
      .jpeg({
        quality: Number(process.env.IMG_QUALITY),
        progressive: true,
        force: false
      })
      .png({
        compressionLevel: Number(process.env.IMG_COMPRESS_LEVEL),
        progressive: true,
        force: false
      })
      .webp({
        quality: Number(process.env.IMG_QUALITY),
        progressive: true,
        force: false
      })
      .toBuffer({ resolveWithObject: true });

    // Call s3 bucket uploading with compress image
    const result = await this.uploadFileInBucket(modeFile, namespace);
    global.logger.info(
      `ImageService:imageCompressAndUpload uploaded file in bucket: url ${JSON.stringify(result)}`
    );
    return result;
  }

  /**
   * This function is upload file in s3 bucket.
   * Using aws-sdk package
   * Return aws file url
   * @param {File obj} compressedFile
   * @param {String} namespace directory inside bucket
   */
  async uploadFileInBucket (compressedFile, namespace) {
    global.logger.info('ImageService.uploadFileInBucket method called!');

    return new Promise(function (resolve, reject) {
      // Create aws instance
      let s3;
      if (
        process.env.NODE_ENV !== 'development' &&
        process.env.NODE_ENV !== 'testing'
      ) {
        s3 = new AWS.S3();
      } else {
        s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        });
      }
      // Create custom name of file /
      const fileName = `${uuid.v4()}.${compressedFile.info ? compressedFile.info.format : '.jpg'}`;
      let fileNameWithNameSpace = fileName;
      if (namespace.trim() !== '') {
        fileNameWithNameSpace = `${namespace.trim()}/${fileName}`;
      }
      // MIME type
      const contentType = mime.lookup(fileName);
      // Setting up S3 upload parameters
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileNameWithNameSpace,
        Body: compressedFile.data,
        ACL: 'public-read',
        ContentType: contentType
      };
      // Uploading files to the bucket
      s3.upload(params, function (err, data) {
        if (err) {
          global.logger.error('ImageService.uploadFileInBucket error', err);
          reject(err);
        } else if (data && data.Location) {
          global.logger.info('ImageService.uploadFileInBucket: Image uploaded! and url is: ' + data.Location);
          resolve({ url: data.Location, filename: fileName });
        } else {
          global.logger.error('ImageService.uploadFileInBucket AWS configuration error');
          reject(new Error('AWS configuration error'));
        }
      });
    });
  }
}

module.exports = ImageService;
