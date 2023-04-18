const axios = require('axios');
const AuthService = require('../services/AuthService');

class UserService {
  /**
   * Get User data from the help of curl request from activate_im server
   * @param {*} jwtToken
   * @param {*} loggedUserEmail
   */
  async getUserProfile (jwtToken, loggedUserEmail) {
    global.logger.info('getUserProfile method called!');

    const response = await axios({
      method: 'GET',
      url: `${process.env.IM_API_URL}v1/user/detail`,
      headers: {
        Authorization: `${jwtToken}`
      }
    });
    global
      .logger
      .info(
        `Fetch user data from ${process.env.IM_API_URL} server with user:${loggedUserEmail}`
      );
    return response.data.data;
  }

  /**
   * Get Users data from the help of curl request from activate_im server
   * @param [{*}] array of ids
   */
  async getUsers (ids) {
    global.logger.info('getUserProfile method called!');
    const token = await AuthService.authM2MToken();
    const response = await axios({
      method: 'POST',
      url: `${process.env.IM_API_URL}v2/user/list`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { _id: ids } // we can also do sorting & queryBuilder here technqiues
    });
    global
      .logger
      .info(`Fetch user data from ${process.env.IM_API_URL} server`);
    return response.data.data.docs;
  }

  /**
   * Get Users data from the help of curl request from activate_im server
   * @param [{*}] array of ids
   */
  async getUsersProfile (ids, email) {
    global.logger.info('getUserProfile method called!');
    const token = await AuthService.authM2MToken();
    let data = { _id: ids };
    if (email) {
      data = { email };
    }
    const response = await axios({
      method: 'POST',
      url: `${process.env.IM_API_URL}v2/user/list`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      data // we can also do sorting & queryBuilder here technqiues
    });
    global
      .logger
      .info(`Fetch user data from ${process.env.IM_API_URL} server`);
    return response.data.data.docs;
  }
}

module.exports = UserService;
