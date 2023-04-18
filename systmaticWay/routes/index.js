const version = `/v${process.env.DEFAULT_API_VERSION}`;
const routes = [
  {
    plugin: require('./health'),
    routes: {
      prefix: `${version}/health`
    }
  },
  {
    plugin: require('./project'),
    routes: {
      prefix: `${version}/project`
    }
  },
  {
    plugin: require('./image'),
    routes: {
      prefix: `${version}/image`
    }
  },
  {
    plugin: require('./user'),
    routes: {
      prefix: `${version}/user`
    }
  }
];

module.exports = routes;
