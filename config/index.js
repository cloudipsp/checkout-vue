
'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

const build = {
  env: require('./prod.env'),
  index: path.resolve(__dirname, '../dist/index.html'),
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: '',  // 'static'
  assetsPublicPath: '',  // '/'
  productionSourceMap: false, // true
  // Gzip off by default as many popular static hosts such as
  // Surge or Netlify already gzip all static assets for you.
  // Before setting to `true`, make sure to:
  // npm install --save-dev compression-webpack-plugin
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report,
  template: 'index.html',
  entry: {
    'checkout.css': './src/less/style.less',
  }
}
const buildMin = {
  env: require('./prod.env'),
  index: path.resolve(__dirname, '../dist/min/index.html'),
  assetsRoot: path.resolve(__dirname, '../dist/min'),
  assetsSubDirectory: '',
  assetsPublicPath: '',
  productionSourceMap: false,
  productionGzip: false,
  productionGzipExtensions: ['js', 'css'],
  bundleAnalyzerReport: process.env.npm_config_report,
  template: 'index-min.html',
  entry: {}
}
const buildCss = {
  env: require('./prod.env'),
  assetsRoot: path.resolve(__dirname, '../dist/css'),
  assetsSubDirectory: '',
  productionSourceMap: false,
  entry: { test: './src/less/test.less' }
}

let buildConfig = build
let opts = process.argv.slice(2)
if (opts.indexOf('--min') > -1) {
  buildConfig = buildMin
} else
if (opts.indexOf('--css') > -1) {
  buildConfig = buildCss
}

module.exports = {
  build: buildConfig,
  dev: {
    env: require('./dev.env'),
    port: process.env.PORT || 8080,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true
  }
}
