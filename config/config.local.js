'use strict';

module.exports = () => {
  const config = (exports = {});

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0',
    },
  };

  config.statics = {
    default: '@egglib/test1',
    clients: {
      '@egglib/test1': {
        type: 'webpack',
      },
      // '@egglib/di': {
      //   // dir: 'src',
      // },
      // '@egglib/test2': {
      //   dir: 'src',
      // },
    },
    env: {
      testdata: 'aaa',
    },
  };

  return { ...config };
};
