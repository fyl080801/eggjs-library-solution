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
  '@egglib/webpack-pages': {
    enable: true,
  },
  '@egglib/test1': {
    enable: true,
  },
  '@egglib/test2': {
    enable: true,
  },
};
