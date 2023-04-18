const Boom = require('@hapi/boom');
const ProjectService = require('../services/ProjectService');

const projectService = new ProjectService();

class ProjectController {
  /**
   * save
   * @param {Object} request - hapi request object
   * @return {object} message
   */
  static async save (request, h) {
    try {
      request.logger.info('ProjectController: save Project method called!');
      const ProjectResp = await projectService.create(request.payload);
      request.logger.info(
        'ProjectController.save: Project saved successfully!'
      );
      return h
        .response({
          statusCode: 200,
          message: 'Project saved successfully!',
          data: ProjectResp
        })
        .code(200);
    } catch (err) {
      request.logger.error(`ProjectController.save: ${err}`);
      if (Boom.isBoom(err)) {
        throw err;
      } else {
        throw new Boom.Boom(err, { statusCode: 500 });
      }
    }
  }

  /**
   * fetch
   * Gets paginated record of project
   * @param {Object} request - hapi request object
   * @return {object} project data
   */
  static async fetch (request, h) {
    try {
      request.logger.info('ProjectController: fetch method called!');
      const queryBuilder = await request.parsedQuery;
      const { where, options } = queryBuilder || {};
      const resultProject = await projectService.fetch(where, options);
      request.logger.info(
        'ProjectController.fetch: Project fetched successfully!'
      );
      return h
        .response({
          statusCode: 200,
          message: 'Project fetched successfully!',
          data: resultProject
        })
        .code(200);
    } catch (err) {
      request.logger.info(`ProjectController.fetch: ${err} ${err.stack}`);
      if (Boom.isBoom(err)) {
        throw err;
      } else {
        throw new Boom.Boom(err, { statusCode: 500 });
      }
    }
  }

  /**
   * update
   * Updates project
   * @param {Object} request - hapi request object
   * @return {object} message
   */
  static async update (request, h) {
    try {
      request.logger.info(
        `ProjectController: update method called! ${JSON.stringify(
          request.payload
        )}`
      );
      const query = { _id: request.params.id };
      const payload = request.payload;
      const isValidId = await projectService.isValidId(query);
      if (!isValidId) {
        return h
          .response({
            statusCode: 422,
            message: 'Id Is not vailid!',
            data: isValidId
          })
          .code(422);
      }
      // check project exist or not
      request.logger.info(
        'ProjectController: projectService.getProject method has called Successfully!'
      );
      const projectDetail = await projectService.getProject(query);
      if (!projectDetail) {
        return h
          .response({
            statusCode: 404,
            message: 'Project does not exists!',
            data: projectDetail
          })
          .code(404);
      }
      let resp = {};
      switch (payload.action) {
      case 'updateMetadata':
        resp = await projectService.updateMetadata(
          request,
          projectDetail,
          payload.metadata
        );
        break;
      case 'assignMaker':
        resp = await projectService.assignMaker(request, payload.maker);
        break;
      case 'assignWearer':
        resp = await projectService.assignWearer(request, payload.wearer);
        break;
      case 'setPrice':
        resp = await projectService.updatePrice(
          request,
          projectDetail,
          payload.price
        );
        break;
      case 'update':
        delete payload.action;
        resp = await projectService.update(request, payload);
        break;
      }

      request.logger.info(
        `Project2Controller.update: Project updated successfully  "${request.params.id}"!`
      );
      return h
        .response({
          statusCode: 200,
          message: 'Project updated successfully!',
          data: resp
        })
        .code(200);
    } catch (err) {
      request.logger.error(`ProjectController.update: ${err}`);
      if (Boom.isBoom(err)) {
        throw err;
      } else {
        throw new Boom.Boom(err, { statusCode: 500 });
      }
    }
  }
}

module.exports = ProjectController;
