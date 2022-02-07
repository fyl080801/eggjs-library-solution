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
  '@egglib/statics': {
    enable: true,
    package: '@egglib/statics-webpack',
  },
  '@egglib/render': {
    enable: false,
  },
  '@egglib/test1': {
    enable: true,
  },
};
