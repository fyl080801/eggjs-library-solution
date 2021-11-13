'use strict';

// const path = require('path');
const { name } = require('./package.json');

// function resolve(dir) {
//   return path.join(__dirname, dir);
// }

module.exports = {
  publicPath: `/${name}/`, // process.env.NODE_ENV === 'production' ? '/public/' : `/${name}/`,
  assetsDir: 'static',
  configureWebpack: {
    // resolve: {
    //   alias: {
    //     '@': resolve('src'),
    //   },
    // },
    output: {
      // 把子应用打包成 umd 库格式
      libraryTarget: 'umd',
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    performance: {
      hints: false,
    },
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      config.output.filename('[name].[hash].js').end();
    }
  },
};
