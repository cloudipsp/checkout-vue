const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()
const increaseSpecificity = require('./build/postcss-increase-specificity')
const autoprefixer = require('autoprefixer')
const argv = require('minimist')(process.argv.slice(2))

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

function addF (options) {
  options.plugins = () => [
    increaseSpecificity({ repeat: 1, stackableRoot: '#f', overrideIds: false }),
    autoprefixer(),
  ]
  return options
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
    ? argv['public-path']
    : '/',
  pluginOptions: {},
  chainWebpack: config => {
    config
      .when(isProduction, config => {
        config
          .module
            .rule('scss')
              .oneOf('normal')
                .use('extract-css-loader')
                  .tap(options => {
                    return {
                      ...options,
                      publicPath: ''
                    }
                  })
                  .end()
                .end()
              .end()
            .end()
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
                gitRevisionPlugin.commithash(),
                new Date().toUTCString(),
              ].join(' '),
              entryOnly: true,
              exclude: /css$/
            }])
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
        .rule('images')
          .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .end()
          .end()
        .rule('svg')
          .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .end()
          .end()
        .end()
      .plugin('define-plugin')
        .use(webpack.DefinePlugin, [
          Object.fromEntries(
            Object.entries({
              VERSION: gitRevisionPlugin.version(),
              COMMITHASH: gitRevisionPlugin.commithash(),
              BRANCH: gitRevisionPlugin.branch(),
              ENVIRONMENT: process.env.NODE_ENV,
              DSN: argv['sentry-dsn'],
            }).map(([name, value]) => [name, JSON.stringify(value)])
          ),
        ])
        .end()
  }
}
