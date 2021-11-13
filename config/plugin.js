'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // },
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  RequestCurl: {
    enable: !!process.env.curl,
    package: 'egg-request-curl',
  },
  '@eggtest/pages': {
    enable: true,
  },
  '@eggtest/test1': {
    enable: true,
  },
  '@eggtest/test2': {
    enable: true,
  },
};
