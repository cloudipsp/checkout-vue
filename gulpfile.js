const fsp = require('fs').promises
const { task, src, dest, series, parallel } = require('gulp')
const nodeGettextGenerator = require('node-gettext-generator')
const configLocale = require('./src/config/locales.json')
const uk = require('@umpirsky/country-list/data/uk/country.json')
const argv = require('minimist')(process.argv.slice(2))

const saas = argv.saas_template_name
const excludes = list => item => !list.includes(item)
const locales = Object.keys(configLocale)

const i18nProcess = (src, parse) => () =>
  fsp
    .readFile(src, 'utf-8')
    .then(content => JSON.parse(content))
    .then(content => (typeof parse === 'function' ? parse(content) : content))
    .then(content =>
      content.reduce((accum, item) => [...accum, `_('${item}')`], [])
    )
    .then(content => content.join('\n'))
    .then(content =>
      fsp.writeFile(
        `./src/i18n/process/${src.match(/\/([\w-]+)\./)[1]}.js`,
        content
      )
    )

task(
  'methods',
  i18nProcess('./src/config/methods.json', content =>
    content.filter(excludes(['trustly', 'wallets']))
  )
)

task(
  'subscription-period',
  i18nProcess('./src/config/subscription-period.json')
)

task(
  'bins',
  i18nProcess('./src/config/bins.json', content =>
    Object.entries(content).map(([name]) => name)
  )
)

task('po', done =>
  nodeGettextGenerator
    .process({
      extract: {
        path: ['./src'],
        target: './src/i18n/process/templates.js',
        match: /\$t\('(.+?)'/g,
        replace: "_('$1')",
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
    .then(() => done())
)

task('i18n', series(parallel('methods', 'subscription-period', 'bins'), 'po'))

task(
  'i18n-need-translation',
  series('i18n', () => {
    const from = 'en'
    const dirname = `./src/i18n/need-translation/`
    let translation

    return fsp
      .readFile(`./src/i18n/po/${from}/translation.json`, 'utf-8')
      .then(content => JSON.parse(content))
      .then(content => (translation = content))
      .then(() => fsp.access(dirname).catch(() => fsp.mkdir(dirname)))
      .then(() =>
        fsp
          .readdir(dirname)
          .then(filenames =>
            filenames.map(filename => fsp.rm(dirname + filename))
          )
          .then(promises => Promise.all(promises))
      )
      .then(() =>
        locales
          .filter(locale => locale !== from)
          .map(locale =>
            fsp
              .readFile(`./src/i18n/po/${locale}/translation.json`, 'utf-8')
              .then(content => JSON.parse(content))
              .then(content => Object.entries(content))
              .then(content => content.filter(([, value]) => !value))
              .then(content => content.map(([name]) => name))
              .then(content =>
                content.map(
                  name => `msgid "${name}"\nmsgstr "${translation[name]}"\n`
                )
              )
              .then(content => content.join('\n'))
              .then(content => fsp.writeFile(`${dirname}${locale}.po`, content))
          )
      )
      .then(promises => Promise.all(promises))
  })
)

task('countries-search', () =>
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

task('countries-calling-codes', () =>
  fsp
    .readFile('./node_modules/world-countries/dist/countries.json', 'utf-8')
    .then(content => JSON.parse(content))
    .then(content => content.filter(({ callingCodes }) => callingCodes.length))
    .then(content =>
      content.map(({ cca2, callingCodes }) => [
        cca2,
        Number(
          callingCodes[0].slice(1, callingCodes.length > 1 ? 2 : undefined)
        ),
      ])
    )
    .then(content => Object.fromEntries(content))
    .then(content => JSON.stringify(content, null, 2))
    .then(content => `export const countriesCallingCodes = ${content}`)
    .then(content =>
      fsp.writeFile('./src/config/countries-calling-codes.js', content)
    )
)

task('exclude-message', () => {
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

task('svg', () => {
  let dirname = './src/assets/svg/'
  return fsp
    .readdir(dirname)
    .then(filenames =>
      filenames.map(filename =>
        fsp
          .readFile(dirname + filename, 'utf-8')
          .then(content => [
            filename.replace('.svg', ''),
            content.match(/ d="([\w\d -.]+)"/)[1],
          ])
      )
    )
    .then(promises => Promise.all(promises))
    .then(content => Object.fromEntries(content))
    .then(content => JSON.stringify(content, null, 2))
    .then(content => `export const svg = ${content}`)
    .then(content => fsp.writeFile('./src/config/svg.js', content))
})

task('favicon', () =>
  src(`./saas-config/${saas}/favicon/*`, { encoding: false }).pipe(
    dest('./public/favicon')
  )
)

task('fonts', () =>
  src(`./saas-config/${saas}/fonts/*`, { encoding: false }).pipe(
    dest('./src/fonts')
  )
)

task('saas-config', () =>
  Promise.all([
    fsp
      .readFile(`./saas-config/${saas}/config.json`, 'utf-8')
      .then(content => JSON.parse(content)),
    fsp
      .access(`./saas-config/${saas}/loading.svg`)
      .then(() => fsp.readFile(`./saas-config/${saas}/loading.svg`, 'base64'))
      .then(content => `data:image/svg+xml;base64,${content}`)
      .catch(() => {}),
  ])
    .then(([config, loading]) => {
      if (loading) {
        config.options.loading = loading
      }
      return config
    })
    .then(content => JSON.stringify(content, null, 2))
    .then(content => `export const saas = ${content}`)
    .then(content => fsp.writeFile('./src/config/saas.js', content))
)

task('env', () =>
  Promise.all([
    fsp
      .readFile(`./saas-config/${saas}/logo/light.svg`, 'base64')
      .then(content => `data:image/svg+xml;base64,${content}`),
    fsp
      .readFile(`./saas-config/${saas}/logo/dark.svg`, 'base64')
      .then(content => `data:image/svg+xml;base64,${content}`),
    fsp
      .readFile(`./saas-config/${saas}/preset.json`, 'utf-8')
      .then(content => JSON.parse(content)),
  ])
    .then(([light, dark, PRESET]) => ({
      LOGO_URL: { light, dark },
      PRESET,
    }))
    .then(content => JSON.stringify(content, null, 2))
    .then(content => fsp.writeFile('./src/config/env.json', content))
)

task('presets-with-gradient', () =>
  fsp
    .readdir('./public/presets/')
    .then(files => files.map(item => item.replace('.jpeg', '')))
    .then(content => JSON.stringify(content, null, 2))
    .then(content => `export const presetsWithGradient = ${content}`)
    .then(content =>
      fsp.writeFile('./src/config/presets-with-gradient.js', content)
    )
)

task(
  'default',
  parallel([
    'i18n',
    'countries-search',
    'countries-calling-codes',
    'exclude-message',
    'svg',
    'favicon',
    'fonts',
    'saas-config',
    'env',
    'presets-with-gradient',
  ])
)
