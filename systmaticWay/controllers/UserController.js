const Boom = require('@hapi/boom');
const { get } = require('lodash');
const axios = require('axios');

class UserController {
  /**
   * login
   * authorise ops users
   * @param {Object} request - hapi request object
   * @return {object} user token
  */
  static async login (request, h) {
    try {
      request.logger.info(`UserController: login method called with payload ${JSON.stringify(request.payload)} !`);

      let result;
      let userRole;
      const platform = get(request.payload, 'platform');

      const objLogin = {
        email: get(request.payload, 'email'),
        password: get(request.payload, 'password')
      };

      await axios({
        url: `${process.env.IM_API_URL}/${process.env.IM_API_VERSION}/auth/userPasswordLogin`,
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'post',
        data: objLogin,
        responseType: 'json'
      }).then(async (response) => {
        request.logger.info(`UserController.login: userPasswordLogin api called successfully with response ${JSON.stringify(response.data)} !`);

        request.logger.info(`UserController.login: calling ${process.env.IM_API_URL}${process.env.IM_API_VERSION}/user/detail api !`);
        const tokenId = get(response.data, 'data.id_token', '');

        await axios({
          url: `${process.env.IM_API_URL}/${process.env.IM_API_VERSION}/user/detail`,
          headers: {
            Authorization: `Bearer ${tokenId}`,
            'Content-Type': 'application/json'
          },
          method: 'get',
          responseType: 'json'
        }).then((responseDetail) => {
          result = get(responseDetail, 'data', {});
          const predefinedRole = { ops: ['admin'] };
          const savedRole = get(result, 'data.profile.role', []);

          if (platform === 'ops') {
            userRole = predefinedRole.ops;
          }

          const permission = userRole.filter(element => savedRole.includes(element));

          if (permission.length > 0) {
            result.message = 'User logged in successfully!';

            result.tokenDetail = {
              token: get(response.data, 'data.id_token', ''),
              id_token: get(response.data, 'data.id_token', ''),
              scope: get(response.data, 'data.scope', ''),
              expires_in: get(response.data, 'data.expires_in', '')
            };
          } else {
            result.message = 'You are not authorised user.';
            result.statusCode = 401;
            result.data = null;
          }
        }).catch(err => {
          request.logger.error(`UserController.login: Error in user detail API call ${err} !`);
          result = {
            statusCode: 500,
            message: 'User not able to log in',
            data: err
          };
        });
      }).catch(err => {
        request.logger.error(`UserController.login: Error in user password API call ${err} !`);
        result = {
          statusCode: 500,
          message: 'User not able to log in',
          data: err
        };
      });

      request.logger.info('UserController.login: User logged in successfully!');
      return h
        .response(result)
        .code(200);
    } catch (err) {
      request.logger.error(`UserController.login: ${err}`);
      if (Boom.isBoom(err)) {
        throw err;
      } else {
        throw new Boom.Boom(err, { statusCode: 500 });
      }
    }
  }

  /**
   * signup
   * user signup with auth0
   * @param {Object} request - hapi request object
   * @return {object} response
  */
  static async signup (request, h) {
    try {
      request.logger.info(`UserController: signup method called with payload ${JSON.stringify(request.payload)}!`);
      let userResp;
      const email = get(request.payload, 'email', '');
      global.logger.info(`UserController: signup - IM API url ${process.env.IM_API_URL}/${process.env.IM_API_VERSION}/user/userSignupWithPassword`);
      await axios({
        url: `${process.env.IM_API_URL}/${process.env.IM_API_VERSION}/user/userSignupWithPassword`,
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        data: {
          email,
          password: get(request.payload, 'password', ''),
          userType: get(request.payload, 'userType', ''),
          role: get(request.payload, 'role', [])
        },
        responseType: 'json'
      }).then(async (response) => {
        global.logger.info(`UserController: signup api called successfully and received response ${JSON.stringify(response.data)} !`);
        userResp = {
          statusCode: 200,
          message: 'User signed up successfully',
          data: {
            email,
            role: get(request.payload, 'role', [])
          }
        };
      }).catch(err => {
        global.logger.info(`UserController: signup: Error in user signup with password API call ${err} !`);
        userResp = {
          statusCode: 500,
          message: 'User signup not succeeded',
          data: err
        };
      });
      request.logger.info(`UserController.signup: User ${email} registered successfully!`);
      return h
        .response(userResp)
        .code(200);
    } catch (err) {
      request.logger.error(`UserController.signup: ${err}`);
      if (Boom.isBoom(err)) {
        throw err;
      } else {
        throw new Boom.Boom(err, { statusCode: 500 });
      }
    }
  }
};

module.exports = UserController;
