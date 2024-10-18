const webpack = require('webpack')
const { defineConfig } = require('@vue/cli-service')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()
const increaseSpecificity = require('./build/postcss-increase-specificity')
const autoprefixer = require('autoprefixer')
const argv = require('minimist')(process.argv.slice(2))
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const PUBLIC_PATH = argv['public-path'] || '/'
const VERSION = gitRevisionPlugin.version()
const COMMITHASH = gitRevisionPlugin.commithash()
const BRANCH = argv.branch || gitRevisionPlugin.branch()
const ENVIRONMENT = argv.environment
const SENTRY_DSN = argv.sentry_dsn
const C2P_SDK = argv.c2p_sdk
const C2P_SRC_INITIATOR_ID = argv.c2p_src_initiator_id
const DOMAIN = (PUBLIC_PATH.match(/https?:\/\/([\w.]+)/) || [])[1]
const SAAS_CDN_URL = argv.saas_cdn_url
const SAAS_TEMPLATE_NAME = argv.saas_template_name
const API_DOMAIN = argv.api_domain
const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

function addF (options) {
  return {
    ...options,
    postcssOptions: {
      plugins: [
        increaseSpecificity({ repeat: 1, stackableRoot: '#f', overrideIds: false }),
        autoprefixer(),
      ]
    }
  }
}

function stringify(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([name, value]) => [name, JSON.stringify(value)])
  )
}

module.exports = defineConfig({
  pages: {
    checkout: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      scriptLoading: 'blocking',
      inject: 'head',
      minify: {
        collapseWhitespace: false, // true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
    },
  },
  devServer: {
    client: {
      webSocketURL: `wss://${DOMAIN}/ws`
    },
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: PUBLIC_PATH,
  css: {
    loaderOptions: {
      scss: {
        additionalData: [
          `$PUBLIC_PATH: '${PUBLIC_PATH}';`,
          `$prefix: --${SAAS_TEMPLATE_NAME}-;`,
          '@import \'~@/scss/core/functions\';',
          '@import \'~@/scss/core/colors\';',
          '@import \'~@/scss/core/variables\';',
          '@import \'~@/scss/core/mixins/index\';',
        ].join('')
      },
      // postcss: {
      //   postcssOptions: {
      //     plugins: [
      //       increaseSpecificity({ repeat: 1, stackableRoot: '#f', overrideIds: false }),
      //       autoprefixer(),
      //     ],
      //   },
      // },
    }
  },
  chainWebpack: config => {
    config
      .when(isProduction, config => {
        config
          .optimization
            .splitChunks({
              cacheGroups: {
                defaultVendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                },
                default: {
                  minChunks: 2,
                },
                styles: {
                  name: 'styles',
                  test: /[\\/]components[\\/]/,
                  type: 'css/mini-extract',
                  enforce: true,
                },
              },
            })
            .end()
          .output.filename('[name].js')
            .end()
          .plugin('extract-css')
            .tap(([options]) => {
              return [{
                ...options,
                ignoreOrder: true,
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
          .plugin('copy')
            .tap(([options])=> {
              let ignore = options.patterns[0].globOptions.ignore
              ignore.push('**/buttons')
              ignore.push('**/examples')
              return [options]
            })
            .end()
      })
      .when(isProduction && PUBLIC_PATH === 'http://localhost:3000/', config => {
        config
          .plugin('webpack-bundle-analyzer')
            .use(BundleAnalyzerPlugin)
            .end()
      })
      .when(isDevelopment, config => {
        config
          .plugin('eslint')
            .tap(([options]) => [
              {
                ...options,
                fix: true,
              },
            ])
            .end()
          .plugin('stylelint')
            .use('stylelint-webpack-plugin',[{
              files: 'src/**/*.scss',
              fix: true,
            }])
            .end()
          .plugin('circular-dependency-plugin')
            .use('circular-dependency-plugin',[{
              exclude: /node_modules/,
              cwd: process.cwd(),
            }])
            .end()
      })
      .plugins
        .delete('prefetch-checkout')
        .end()
      .entryPoints
        .delete('app')
        .end()
      .module
        .rule('scss')
          .oneOf('vue').use('postcss-loader').tap(addF).end().end()
          .oneOf('normal').use('postcss-loader').tap(addF).end().end()
          .end()
        .rules.delete('svg').end()
        .rule('svg')
          .test(/\.(svg)(\?.*)?$/)
          .oneOf('svg-component')
            .test(/src\/svg/)
            .use('vue-loader')
              .loader('vue-loader')
              .end()
            .use('vue-svg-loader')
              .loader('vue-svg-loader')
              .options({ svgo: { plugins: [{ cleanupIDs: false }] } })
              .end()
            .end()
          .oneOf('svg')
            .set('type', 'asset/resource')
            .set('generator', {
              filename: 'img/[name].[hash:8][ext]'
            })
            .end()
          .end()
        .end()
      .plugin('define-plugin')
        .use(webpack.DefinePlugin, [stringify({
          VERSION,
          COMMITHASH,
          BRANCH,
          ENVIRONMENT,
          SENTRY_DSN,
          DOMAIN,
          SAAS_CDN_URL,
          SAAS_TEMPLATE_NAME,
          API_DOMAIN,
          C2P_SDK,
          C2P_SRC_INITIATOR_ID,
        })])
        .end()
  }
})
