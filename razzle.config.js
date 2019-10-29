'use strict';

module.exports = {
  modify: (defaultConfig, { target, dev }, webpack) => {
    const config = defaultConfig;

    if (target === 'web' && dev) {
      config.devServer.quiet = false;

      config.module.rules = config.module.rules.reduce((rules, rule) => {
        if (rule.test &&
          rule.test.toString()===/\.(js|jsx|mjs)$/.toString() &&
          !rule.enforce) {

          const { use, exclude, ...rest } = rule;

          rules.push({ ...rule, ...{
            exclude: [ /(!opencv).js$/, exclude ].filter(x=>x)
          }});

        }
        else {
          rules.push(rule);
        } 
        return rules;
      }, []);
    }
    return config;
  },
  plugins: [ 'proxy', 'worker', 'wasm' ] 
};