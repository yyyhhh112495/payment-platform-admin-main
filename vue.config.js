const path = require('path')
const webpack = require('webpack')
const resolve = dir => {
  return path.join(__dirname, dir)
}
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']
module.exports = {
  publicPath: '/payment-platform-admin/',
  productionSourceMap: process.env.VUE_APP_FLAG === 'production' ? false : true,
  chainWebpack: config => {
    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    config.resolve.alias
      .set('@', resolve('src'))
    config
      .optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: 6,
        cacheGroups: {
          antvue: {
            priority: 10,
            test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/
          },
          antdesgin: {
            priority: 10,
            test: /[\\/]node_modules[\\/]_?@ant-design(.*)/
          },
          lottieweb: {
            priority: 10,
            test: /[\\/]node_modules[\\/]_?lottie-web(.*)/
          },
          lodash: {
            priority: 10,
            test: /[\\/]node_modules[\\/]_?lodash(.*)/
          },
          moment: {
            priority: 10,
            test: /[\\/]node_modules[\\/]_?moment(.*)/
          }
        }
      })
    config.optimization.runtimeChunk('single')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugin('ContextReplacementPlugin').use(webpack.ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-cn/])
  },
  configureWebpack: config => {
    // 生产环境去掉日志
    if (process.env.VUE_APP_FLAG === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
    }
    config.plugins.push(new CompressionWebpackPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), // 匹配文件名
      threshold: 10240, // 对10K以上的数据进行压缩
      minRatio: 0.8,
      deleteOriginalAssets: process.env.VUE_APP_FLAG === 'production' ? true : false
    }))
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, './src/styles/theme.less')
      ]
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'border-radius-base': '2px'
        }
      }
    }
  }
}
