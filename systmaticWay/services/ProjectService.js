'use strict';

const Project = require('../models/project');
const { _, get, has } = require('lodash');
const ObjectId = require('mongoose').Types.ObjectId;

class ProjectService {
  /**
   * Add Project record
   * @param {*} postObj
   */
  async create (payload) {
    global.logger.info('ProjectService: create method called!');

    const postObj = {
      name: get(payload, 'name', ''),
      referrer: get(payload, 'referrer', ''),
      status: get(payload, 'status', '')
    };
    if (has(payload, 'wearer')) {
      postObj.wearer = payload.wearer;
    }
    return await Project.create(postObj);
  }

  /**
   * get paginated Project records
   * @param {*} request
   */
  async fetch (where, options) {
    global.logger.info('ProjectService: fetch method called!');
    return await Project.paginate(where, options);
  }

  /**
  * Check Id is Vaild
  * @param {*} request
  */
  async isValidId (query) {
    global.logger.info('ProjectService: IsValidId method called!');
    if (ObjectId.isValid(query._id)) {
      if ((String)(new ObjectId(query._id)) === (query._id)) { return true; }
      return false;
    }
    return false;
  }

  /**
   * get Project records
   * @param {*} request
   */
  async getProject (query) {
    global.logger.info('ProjectService: get method called!');
    return await Project.findOne(query);
  }

  /**
   * update Project records
   * @param {*} request
   * @param {object} payload
   */
  async update (request, payload) {
    global.logger.info('ProjectService: update method called!');
    const projectId = request.params.id;
    const updateObj = {};
    for (const [key, value] of Object.entries(payload)) {
      updateObj[key] = value;
    }
    global.logger.info(`ProjectService: update for project ${projectId}, metadata: ${JSON.stringify(updateObj)}`);
    return await Project.updateOne(
      { _id: projectId },
      { $set: updateObj }
    );
  }

  /**
   * update Project metadata
   * @param {*} request
   */
  async updateMetadata (request, projectDetail, metadata) {
    global.logger.info('ProjectService: updateMetadata method called!');
    const projectId = request.params.id;
    const metadataObj = get(projectDetail, 'metadata', {});
    for (const [key, value] of Object.entries(metadata)) {
      metadataObj[key] = value;
    }
    global.logger.info(`ProjectService: updateMetadata for project ${projectId}, metadata: ${JSON.stringify(metadataObj)}`);
    return await Project.updateOne(
      { _id: projectId },
      { $set: { metadata: metadataObj } }
    );
  }

  /**
   * update Project setPrice
   * @param {*} request
   */
  async updatePrice (request, projectDetail, setPrice) {
    global.logger.info('ProjectService: updatePrice method called!');
    const projectId = request.params.id;
    const setPriceArray = _.get(projectDetail, 'price', []);
    let paidStatus = 0;
    for (let i = 0; i < setPriceArray.length; i++) {
      if (setPriceArray[i].status === 'fail' || setPriceArray[i].status === 'unpaid') {
        setPriceArray[i] = {
          netPrice: _.get(setPrice, 'netPrice'),
          serviceFee: _.get(setPrice, 'serviceFee'),
          total: _.get(setPrice, 'total'),
          status: _.get(setPrice, 'status')
        };
        paidStatus = 1;
      }
    }
    if (paidStatus === 0) {
      setPriceArray.push({
        netPrice: _.get(setPrice, 'netPrice'),
        serviceFee: _.get(setPrice, 'serviceFee'),
        total: _.get(setPrice, 'total'),
        status: _.get(setPrice, 'status')
      });
    }
    global.logger.info(
      `ProjectService: updatePrice for project ${projectId}, price: ${JSON.stringify(
        setPriceArray
      )}`
    );
    return await Project.updateOne(
      { _id: projectId },
      { $set: { price: setPriceArray } }
    );
  }

  /**
   * assignMaker to project
   * @param {*} request
   * @param {*} payload
   */
  async assignMaker (request, payload) {
    global.logger.info('ProjectService: assignMaker method called!');
    const projectId = request.params.id;

    global.logger.info(`ProjectService: assign maker to project ${projectId}, metadata: ${JSON.stringify(payload)}`);
    return await Project.updateOne(
      { _id: projectId },
      {
        $set: {
          maker: {
            id: get(payload, 'id', ''),
            name: get(payload, 'name', ''),
            phoneNumber: get(payload, 'phoneNumber', ''),
            email: get(payload, 'email', ''),
            avatar: get(payload, 'avatar', '')
          }
        }
      }
    );
  }

  /**
   * assignWearer to project
   * @param {*} request
   */
  async assignWearer (request, payload) {
    global.logger.info('ProjectService: assignWearer method called!');
    const projectId = request.params.id;
    const wearerObj = {
      id: get(payload, 'id', ''),
      name: get(payload, 'name', ''),
      phoneNumber: get(payload, 'phoneNumber', ''),
      avatar: get(payload, 'avatar', '')
    };
    const wearerEmail = get(payload, 'email', '');
    if (wearerEmail) {
      wearerObj.email = wearerEmail;
    }
    global.logger.info(`ProjectService: assign wearer to project ${projectId}, metadata: ${JSON.stringify(payload)}`);
    return await Project.updateOne(
      { _id: projectId },
      {
        $set: {
          wearer: wearerObj
        }
      }
    );
  }
}

module.exports = ProjectService;
