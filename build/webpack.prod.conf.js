'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const increaseSpecificity = require('./postcss-increase-specificity')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

process.noDeprecation = true

const cssLoader = {
  loader: 'css-loader',
  options: {
    minimize: true,
    sourceMap: config.build.productionSourceMap
  }
}

const autoprefixerLoader = {
  loader: 'autoprefixer-loader',
  options: {
    browsers:['> 1%', 'last 2 versions', 'ie >= 9']
  }
}

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: config.build.productionSourceMap,
    plugins: () => [
      increaseSpecificity({ repeat: 1, stackableRoot: '#f', overrideIds: false }),
    ]
  }
}

const webpackConfig = merge(baseWebpackConfig, {
  // module: {
  //   rules: utils.styleLoaders({
  //     sourceMap: config.build.productionSourceMap,
  //     extract: true
  //   })
  // },
  module: {
    rules: [
      {
        test: /(style-sm|style-md)\.less$/,
        use: ['style-loader', cssLoader, 'group-css-media-queries-loader', autoprefixerLoader, postcssLoader, 'less-loader']
      },
      {
        test: /^((?!style-sm|style-md).)*\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [cssLoader, autoprefixerLoader, postcssLoader, 'less-loader']
        })
      }
    ]
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  entry: {
    'checkout-dark': './src/less/style-dark.less',
  },
  // output: {
  //   path: config.build.assetsRoot,
  //   filename: utils.assetsPath('[name].js'), // 'js/[name].[chunkhash].js'
  //   chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  // },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('[name].css') // 'css/[name].[contenthash].css'
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        discardComments: {
          removeAll: true,
        }
      }
    }),

    new webpack.BannerPlugin(gitRevisionPlugin.branch() + ' ' + gitRevisionPlugin.commithash()),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: config.build.template,
      inject: 'head',
      minify: {
        removeComments: true,
        collapseWhitespace: false, // true
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      chunks: ['checkout'],
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
    })
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
