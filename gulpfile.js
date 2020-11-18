const fs = require('fs')
const gulp = require('gulp')
const nodeGettextGenerator = require('node-gettext-generator')
const configLocale = require('./src/config/locales.json')

const locales = Object.keys(configLocale)

function process(src) {
  return done => {
    let arr = JSON.parse(fs.readFileSync(src, 'utf8'))
    let resultFileName = src.match(/\/([\w-]+)\./)[1]
    let contents = []

    arr.map(item => contents.push(`_('${item}')`))
    fs.writeFileSync(
      `./src/i18n/process/${resultFileName}.js`,
      contents.join('\n')
    )

    done()
  }
}

gulp.task('methods', process('./src/config/methods.json'))

gulp.task(
  'subscription-period',
  process('./src/config/subscription-period.json')
)

gulp.task('po', function (done) {
  return nodeGettextGenerator
    .process({
      extract: {
        path: ['./src/components', './src/config', './src/checkout.vue'],
        target: './src/i18n/process/templates.js',
        // title="tran1"
        // text="tran1"
        // name="tran1"
        // label="tran1"
        // placeholder="tran1"
        // v-t="'tran2'"
        // $t('tran3')
        // label: 'tran4'
        // placeholder: 'tran4'
        // name: 'tran4'
        // { path: 'tran4'
        match: /(?:(?<!(?:(?:svg|transition|slot)[ ])|[^ ])(?:title|text|name|label|placeholder)=(["'])([^{}]+?)\1)|(?:v-t="'(.+?)'")|(?:\$t\((["'])(.+?)\4)|(?:(?:label|placeholder|name|{ path):[ ]?(["'])(.+?)\6)/g,
        replace: "_('$2$3$5$7')",
      },
      params: {
        name: 'messages',
        keywords: ['_'],
        source: ['./src/i18n/process'],
        target: './src/i18n/po',
        locales,
      },
    })
    .then(function () {
      done()
    })
})

gulp.task('locale', gulp.series('methods', 'subscription-period', 'po'))
