'use strict';

const path = require('path');
const { name } = require('./package.json');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: `/${name}/`,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      libraryExport: 'default',
      libraryTarget: 'umd',
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    performance: {
      hints: false,
    },
  },
  // chainWebpack: (config) => {
  //   if (process.env.NODE_ENV === 'development') {
  //     config.output.filename('[name].[hash].js').end();
  //   }
  // },
};
