'use strict'

module.exports = {
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
  RequestCurl: {
    enable: !!process.env.curl,
    package: 'egg-request-curl',
  },
  '@egglib/mock': {
    enable: true,
  },
  '@egglib/statics': {
    enable: true,
  },
  '@egglib/render': {
    enable: true,
  },
  '@egglib/render-editor': {
    enable: true,
  },
}
