'use strict';

// const path = require('path');
const { name } = require('./package.json');
const SystemJSPublicPathWebpackPlugin = require('systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin');

// function resolve(dir) {
//   return path.join(__dirname, dir);
// }

module.exports = {
  publicPath: `/${name}/`,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {},
    output: {
      filename: 'index.js',
      // libraryTarget: 'system',
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    performance: {
      hints: false,
    },
    plugins: [
      new SystemJSPublicPathWebpackPlugin({
        rootDirectoryLevel: 1,

        // ONLY NEEDED FOR WEBPACK 1-4. Not necessary for webpack@5
        systemjsModuleName: '@egglib/test2',
      }),
    ],
  },
  // chainWebpack: (config) => {
  //   if (process.env.NODE_ENV === 'development') {
  //     config.output.filename('[name].[hash].js').end();
  //   }
  // },
};
