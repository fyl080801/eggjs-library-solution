const path = require('path')
const { name } = require('./package.json')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// function resolvePackage(dir) {
//   return path.resolve(__dirname, '../', dir)
// }

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
    output: {
      library: `${name}`,
      libraryTarget: 'umd',
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    performance: {
      hints: false,
    },
  },
  pluginOptions: {},
  chainWebpack(config) {
    // babel 因为服务是从server启动的，这里手动加载babel config
    config.module
      .rule('compile')
      .test(/\.js$/)
      .include.add(resolve('src'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .options(require('./babel.config'))
      .end()

    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('cheap-source-map')
    })
  },
}
