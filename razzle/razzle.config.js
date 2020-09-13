'use strict';


module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.quiet = false;
      config.devServer.public = 'localhost:443';
      config.devServer.proxy = {
        context: () => true,
        target: 'http://localhost:3000'
      };
    }

    return config;
  },
};
