'use strict';

module.exports = () => {
  const config = (exports = {});

  config.pages = {
    enableWebpack: true,
    matcher: () => {
      return '@eggtest/test1';
    },
  };

  return { ...config };
};
