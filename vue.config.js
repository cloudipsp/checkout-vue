const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()
const increaseSpecificity = require('./build/postcss-increase-specificity')
const autoprefixer = require('autoprefixer')
const argv = require('minimist')(process.argv.slice(2))
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const publicPath = argv['public-path']
const VERSION = gitRevisionPlugin.version()
const COMMITHASH = gitRevisionPlugin.commithash()
const BRANCH = gitRevisionPlugin.branch()
const ENVIRONMENT = process.env.NODE_ENV
const DSN = argv['sentry-dsn']
const DOMAIN = ((publicPath || '').match(/https?:\/\/([\w.]+)/) || [])[1]
const CDN = 'https://pay.fondy.eu/icons/dist/'
const isProduction = ENVIRONMENT === 'production'
const isDevelopment = ENVIRONMENT === 'development'

function addF (options) {
  options.plugins = () => [
    increaseSpecificity({ repeat: 1, stackableRoot: '#f', overrideIds: false }),
    autoprefixer(),
  ]
  return options
}

function stringify(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([name, value]) => [name, JSON.stringify(value)])
  )
}

module.exports = {
  pages: {
    checkout: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      inject: 'head',
      minify: {
        collapseWhitespace: false, // true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    },
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    public: 'checkout.dev.cipsp.net',
  },
  lintOnSave: isDevelopment,
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: isProduction
    ? publicPath
    : '/',
  pluginOptions: {},
  css: {
    loaderOptions: {
      scss: {
        additionalData: [
          '@import \'~@/scss/core/functions\';',
          '@import \'~@/scss/core/colors\';',
          '@import \'~@/scss/core/variables\';',
          '@import \'~@/scss/core/mixins/index\';',
        ].join('')
      },
    }
  },
  chainWebpack: config => {
    config
      .when(isProduction, config => {
        config
          .optimization
            .splitChunks(false)
            .minimizer('terser')
              .tap(([options]) => {
                let terserOptions = options.terserOptions
                terserOptions.compress = {
                  ...terserOptions.compress,
                  collapse_vars: true,
                  comparisons: true,
                  hoist_funs: true,
                  hoist_props: true,
                  inline: true,
                  loops: true,
                  negate_iife: true,
                  properties: true,
                  reduce_vars: true,
                  switches: true,
                  typeofs: true,
                  passes: 2,
                }
                terserOptions.output = terserOptions.output || {}
                terserOptions.output.comments = /^! (npm|build)/
                return [options]
              })
              .end()
            .end()
          .plugin('extract-css')
            .tap(([options]) => {
              return [{
                ...options,
                filename: '[name].css'
              }]
            })
            .end()
          .plugin('banner')
            .use(webpack.BannerPlugin, [{
              banner: [
                (argv.version ?
                  `npm ${argv.version} parent` :
                  'build'),
                'commithash',
                COMMITHASH,
                new Date().toUTCString(),
              ].join(' '),
              entryOnly: true,
              exclude: /css$/
            }])
            .end()
      })
      .when(isProduction && !publicPath, config => {
        config
          .plugin('webpack-bundle-analyzer')
            .use(BundleAnalyzerPlugin)
            .end()
      })
      .when(isDevelopment, config => {
        config
          .module
            .rule('eslint')
              .use('eslint-loader')
                .tap(options => {
                  options.fix = true
                  return options
                })
                .end()
              .end()
            .end()
          .plugin('stylelint')
            .use('stylelint-webpack-plugin',[{
              files: 'src/**/*.scss'
            }])
            .end()
          .plugin('circular-dependency-plugin')
            .use('circular-dependency-plugin',[{
              exclude: /node_modules/,
              cwd: process.cwd(),
            }])
            .end()
      })

    config
      .plugins
        .delete('prefetch-checkout')
        .end()
      .entryPoints
        .delete('app')
        .end()
      .output
        .filename('[name].js')
        .jsonpFunction('fondyJsonp')
        .end()
      .module
        .rule('scss')
          .oneOf('vue').use('postcss-loader').tap(addF).end().end()
          .oneOf('normal').use('postcss-loader').tap(addF).end().end()
          .end()
        .rule('svg')
          .uses.clear()
            .end()
          .use('vue-loader')
            .loader('vue-loader')
            .end()
          .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .end()
          .end()
        .end()
      .plugin('define-plugin')
        .use(webpack.DefinePlugin, [stringify({
          VERSION,
          COMMITHASH,
          BRANCH,
          ENVIRONMENT,
          DSN,
          DOMAIN,
          CDN,
        })])
        .end()
  }
}
