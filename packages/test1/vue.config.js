'use strict';

const path = require('path');
const { name } = require('./package.json');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: `/${name}/`,
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    // qiankun need it
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp-${name}`,
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    performance: {
      hints: false,
    },
  },
  chainWebpack(config) {
    // babel 因为服务是从server启动的，这里手动加载babel config
    config.module
      .rule('compile')
      .test(/\.js$/)
      .include.add(resolve('src'))
      // .add(resolvePackage('shared/src'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .options(require('./babel.config'))
      .end();
  },
};
