'use strict';

module.exports = {
  modify: (defaultConfig, { target, dev }, webpack) => {
    const config = defaultConfig;

    if (target === 'web' && dev) {
      config.devServer.quiet = false;
    }

    return config;
  },
  plugins: [ 'proxy', 'worker', 'wasm' ] 
};