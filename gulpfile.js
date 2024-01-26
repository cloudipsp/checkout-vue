const fs = require('fs')
const fsp = require('fs').promises
const gulp = require('gulp')
const nodeGettextGenerator = require('node-gettext-generator')
const configLocale = require('./src/config/locales.json')
const uk = require('@umpirsky/country-list/data/uk/country.json')

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
        path: [
          './src/components',
          './src/views',
          './src/config',
          './src/app.vue',
        ],
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
        match:
          /(?:(?<!(?:(?:svg|transition|slot)[ ])|[^ ])(?:title|text|label|placeholder)=(["'])([^{}]+?)\1)|(?:v-t="'(.+?)'")|(?:\$t\((["'])(.+?)\4)|(?:(?:label|placeholder|name|{ path):[ ]?(["'])(.+?)\6)/g,
        replace: "_('$2$3$5$7')",
      },
      params: {
        name: 'messages',
        noLocation: true,
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

gulp.task('countries-search', () =>
  fsp
    .readFile('./node_modules/world-countries/dist/countries.json', 'utf-8')
    .then(content => JSON.parse(content))
    .then(content =>
      content.map(
        ({
          name: { native, common },
          translations,
          altSpellings,
          cca2,
          cca3,
        }) => {
          let result = Object.values({
            ...native,
            ...translations,
          }).map(({ common }) => common)

          const regexp =
            / (of|de|in|e|i|et|и|y|ja|and|a|en|du|do|la|the|des|wa|da|di|del|ko|o|und|im|в|na|dé|ya|oa|ta'|ng|er|—|y'u|og|aṣ|al|as|at|for|von|die|les|ye|dos|los) /g
          const start = /^(the|a|aṣ|al) /
          const end = / (of|a|us|the)$/

          if (uk[cca2]) {
            result.push(uk[cca2])
          }

          result = [cca2, cca3, ...result, common, ...altSpellings]
            .map(item => item.toLowerCase())
            .map(item => item.replace(/[,().]/g, ''))
            .map(item =>
              item.replace(
                /([\u00BF-\u1FFF\u2C00-\uD7FF\w])-([\u00BF-\u1FFF\u2C00-\uD7FF\w])/g,
                '$1 $2'
              )
            )
            .map(item => item.replace(start, ''))
            .map(item => item.replace(start, ''))
            .map(item => item.replace(end, ''))
            .map(item => item.replace(end, ''))
            .map(item => item.replace(regexp, ' '))
            .map(item => item.replace(regexp, ' '))
            .filter(item => item.split(' ').length < 4)
            .reduce((accum, value) => [...accum, ...value.split(' ')], [])
            .filter((item, key, self) => self.indexOf(item) === key)

          return [cca2, result]
        }
      )
    )
    .then(content => Object.fromEntries(content))
    .then(content => JSON.stringify(content, null, 2))
    .then(content => `export const countriesSearch = ${content}`)
    .then(content => fsp.writeFile('./src/config/countries-search.js', content))
)

gulp.task('exclude-message', () => {
  const dirname = './src/'
  return fsp
    .readdir(dirname, {
      recursive: true,
    })
    .then(filenames =>
      filenames.map(filename => {
        const path = dirname + filename

        return fsp
          .stat(path)
          .then(stats =>
            stats.isDirectory() ? Promise.reject() : Promise.resolve(path)
          )
      })
    )
    .then(promises => Promise.allSettled(promises))
    .then(results => results.map(({ value }) => value).filter(item => item))
    .then(paths =>
      paths.map(path =>
        fsp
          .readFile(path, 'utf-8')
          .then(content => [...content.matchAll(/v-html="\$t\('(\w+?)'/g)])
          .then(content => content.map(([, item]) => item))
      )
    )
    .then(promises => Promise.all(promises))
    .then(content => content.flat())
    .then(content =>
      content.filter((item, key, self) => self.indexOf(item) === key)
    )
    .then(content => JSON.stringify(content, null, 2))
    .then(content => `export const excludeMessages = ${content}`)
    .then(content => fsp.writeFile('./src/config/exclude-messages.js', content))
})

gulp.task(
  'default',
  gulp.series(['locale', 'countries-search', 'exclude-message'])
)
