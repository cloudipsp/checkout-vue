const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()
const increaseSpecificity = require('./build/postcss-increase-specificity')
const autoprefixer = require('autoprefixer')
const argv = require('minimist')(process.argv.slice(2))

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
    snippet: {
      entry: 'src/snippet.js',
      template: 'public/index_snippet.html',
      filename: 'index_snippet.html',
      inject: 'head',
    },
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    public: 'checkout.dev.cipsp.net',
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? ''
    : '/',
  pluginOptions: {},
  chainWebpack: config => {
    const normalRule = config.module.rule('scss').oneOfs.get('normal')

    config
      .when(process.env.NODE_ENV === 'production', config => {
        config
          .optimization
            .delete('splitChunks')
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
            .tap(() => {
              return [{
                filename: '[name].css'
              }]
            })
            .end()
          .plugin('banner')
            .use(webpack.BannerPlugin, [[
              (argv.version ?
                `npm ${argv.version} parent` :
                'build'),
              'commithash',
              gitRevisionPlugin.commithash(),
              new Date().toUTCString(),
            ].join(' ')])
            .end()
          .module
            .rule('scss')
              .oneOf('normal')
                .use('extract-css-loader')
                  .tap(options => ({...options,  publicPath: ''}))
                  .end()
                .end()
              .end()
            .end()
      })
      .when(process.env.NODE_ENV !== 'production', config => {
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
      .performance
        .hints(false)
        .end()
      .entryPoints
        .delete('app')
        .end()
      .output
        .filename('[name].js')
        .chunkFilename('[name].js')
        .jsonpFunction('fondyJsonp')
        .end()
      .module
        .rule('scss')
          .oneOf('vue').use('postcss-loader').tap(addF).end().end()
          .oneOf('normal').use('postcss-loader').tap(addF).end().end()
          .oneOf('no-extract')
            .resourceQuery(/\?no-extract/)
            .use('vue-style-loader')
              .loader('vue-style-loader')
              .options({
                sourceMap: false,
                shadowMode: false
              })
              .end()
            .use('css-loader')
              .loader('css-loader')
              .options({
                sourceMap: false,
                importLoaders: 2
              })
              .end()
            .use('postcss-loader')
              .loader('postcss-loader')
              .options({
                sourceMap: false
              })
              .tap(addF)
              .end()
            .use('sass-loader')
              .loader('sass-loader')
              .options({
                sourceMap: false
              })
              .end()
            .end()
            .oneOfs
              .delete('normal') // TODO https://github.com/neutrinojs/webpack-chain/issues/119
              .set('normal', normalRule)
              .end()
          .end()
        .rule('images')
          .use('url-loader')
            .tap(options => {
              delete options.limit
              return options
            })
            .end()
          .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .end()
          .end()
        .rule('svg')
          .uses
            .clear()
            .end()
          .use('url-loader')
            .loader('url-loader')
            .end()
          .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .end()
          .end()
        .end()
      .plugin('define-plugin')
        .use(webpack.DefinePlugin,[{
          'VERSION': JSON.stringify(gitRevisionPlugin.version()),
          'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
          'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
        }])
        .end()
  }
}
