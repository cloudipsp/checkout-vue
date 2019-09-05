const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
const increaseSpecificity = require('./build/postcss-increase-specificity');

function addF (options) {
  options.plugins = () => [
    increaseSpecificity({ repeat: 1, stackableRoot: '#f', overrideIds: false }),
  ];
  return options
}

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['checkout'],
      inject: 'head',
      minify: {
        collapseWhitespace: false, // true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    },
    e2e: {
      entry: 'src/main.js',
      template: 'public/e2e.html',
      filename: 'e2e.html',
      chunks: ['checkout'],
      inject: 'head',
    },
    e2e_snippet: {
      entry: 'src/main.js',
      template: 'public/e2e_snippet.html',
      filename: 'e2e_snippet.html',
      chunks: ['snippet'],
      inject: 'head',
    },
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  },
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? ''
    : '/',
  pluginOptions: {},
  chainWebpack: config => {
    config
      .when(process.env.NODE_ENV === 'production', config => {
        config
          .entry('checkout-dark')
            .add('./src/less/style-dark.less')
            .end()
          .entry('snippet')
            .add('./src/snippet.js')
            .end()
          .optimization
            .delete('splitChunks')
            .end()
          .plugin('extract-css')
            .tap(() => {
              return [{
                filename: '[name].css'
              }]
            })
            .end()
          .plugin('banner')
            .use(webpack.BannerPlugin, [gitRevisionPlugin.branch() + ' parent commithash ' + gitRevisionPlugin.commithash()])
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
      })

    config
      .performance
        .hints(false)
        .end()
      .plugins
        .delete('prefetch-index')
        .delete('prefetch-e2e')
        .delete('prefetch-e2e_snippet')
        .delete('preload-index')
        .delete('preload-e2e')
        .delete('preload-e2e_snippet')
        .end()
      .entryPoints
        .delete('app')
        .delete('index')
        .delete('e2e')
        .delete('e2e_snippet')
        .end()
      .entry('checkout')
        .add('./src/less/style.less')
        .add('./src/main.js')
        .end()
      .output
        .filename('[name].js')
        .chunkFilename('[name].js')
        .end()
      .module
        .rule('less')
          .oneOf('vue').use('postcss-loader').tap(addF).end().end()
          .oneOf('normal').use('postcss-loader').tap(addF).end().end()
          .oneOfs
            .set('no-extract', config.module.rule('less').oneOfs.get('vue'))
            .end()
          .oneOf('no-extract')
            .resourceQuery(/no-extract/)
            .uses
              .delete('extract-css-loader')
              .end()
            .end()
          .end()
        .rule('images')
          .use('url-loader')
            .tap(options => {
              delete options.limit;
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
        .rule('fonts')
          .use('url-loader')
            .tap(options => {
              delete options.limit;
              return options
            })
            .end()
          .end()
        .end()
      .plugin('stylelint')
        .use('stylelint-webpack-plugin')
        .tap(() => {
          return [{
            files: 'src/**/*.less'
          }]
        })
        .end()
  }
}
