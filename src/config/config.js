import configLocales from '@/config/locales.json'
import methods from '@/config/methods.json'
import period from '@/config/subscription-period.json'
import configCountries from '@/config/countries'
import rules from 'async-validator/es/rule/'
import cssVarisble from '@/config/css-varisble'
import configCardBrands from '@/config/card-brands'
import configPresets from '@/config/presets'
import configTheme from '@/config/theme'
import configOptionsDefault from '@/config/options-default'
import configSubscription from '@/config/subscription'
import configNotSet from '@/config/not-set'
import { excludes } from '@/utils/helpers'

const cardIcons = Object.keys(configCardBrands)
const css = ['bootstrap3', 'bootstrap4', 'foundation6']
const YN = ['Y', 'N', 'y', 'n']
const verificationType = ['amount', 'code']
const theme = Object.keys(configTheme)
const preset = Object.keys(configPresets)
const locales = Object.keys(configLocales)
const options = Object.keys(configOptionsDefault.options)
const endpoint = Object.keys(configOptionsDefault.options.endpoint)
const subscription = Object.keys(configOptionsDefault.options.subscription)
const recurring_data_include = Object.keys(
  configOptionsDefault.params.recurring_data
)
const recurring_data_exclude = Object.keys(configNotSet.params.recurring_data)
const recurring_data = recurring_data_include.filter(
  excludes(recurring_data_exclude)
)
const subscriptionType = Object.keys(configSubscription)
const config = ['options', 'params', 'messages', 'validate', 'css_variable']
const patternUrlImg = /^(http(s)?:\/\/|(url\()?data:image\/\w+?;base64,)/

function enumArray(array) {
  return {
    type: 'array',
    validator(rule, value, callback, source, options) {
      if (!rule.required && !source.hasOwnProperty(rule.field))
        return callback()
      let errors = []
      if (Array.isArray(value)) {
        value.forEach(function(item) {
          if (array.includes(item)) return
          errors.push(
            [
              rule.fullField,
              item,
              'is not equal to one of',
              array.join(', '),
            ].join(' ')
          )
        })
      } else {
        rules.type(rule, value, source, errors, options)
      }
      callback(errors)
    },
  }
}

function enumObject(array) {
  return {
    type: 'object',
    fields: {},
    validator(rule, value = {}, callback) {
      let errors = []
      Object.keys(value).forEach(item => {
        if (array.includes(item)) return
        errors.push(
          [
            rule.fullField,
            item,
            'is not equal to one of',
            array.join(', '),
          ].join(' ')
        )
      })
      callback(errors)
    },
  }
}

function validatorToken() {
  return {
    validator(rule, value, callback, source) {
      let errors = []
      if (source.token && rule.field in source) {
        errors.push(
          [
            'Parameter',
            rule.fullField,
            "can't be modified when token is used.",
          ].join(' ')
        )
      }
      callback(errors)
    },
  }
}

function validatorCurrencyRequired() {
  return {
    validator(rule, value, callback, source) {
      let errors = []
      if (!source.token && !value) {
        errors.push([rule.fullField, 'is required'].join(' '))
      }
      callback(errors)
    },
  }
}

function validatorNotEmpty() {
  return {
    validator(rule, value, callback) {
      let errors = []
      if (value === '' || value === null) {
        errors.push(['Parameter', rule.fullField, "can't be empty."].join(' '))
      }
      callback(errors)
    },
  }
}

let i18n = enumObject(locales)

locales.forEach(function(locale) {
  i18n.fields[locale] = {
    type: 'object',
  }
})

const cssVarisbleKeys = Object.keys(
  cssVarisble({
    type: 'light',
    preset: configTheme['light'],
  })
)

let css_variable = enumObject(cssVarisbleKeys)

const configCssVariable = {
  card_img: {
    type: 'string',
    pattern: patternUrlImg,
  },
}

cssVarisbleKeys.forEach(item => {
  css_variable.fields[item] = configCssVariable[item] || [
    validatorNotEmpty(),
    {
      type: 'string',
      pattern: /^#[0-9a-fA-F]{6}$/,
    },
  ]
})

export default {
  config: {
    ...enumObject(config),
    fields: {
      options: {
        ...enumObject(options),
        fields: {
          methods: enumArray(methods),
          methods_disabled: enumArray(methods),
          card_icons: enumArray(cardIcons),
          fields: { type: 'boolean' },
          title: { type: 'string' },
          link: { type: 'url' },
          full_screen: { type: 'boolean' },
          button: { type: 'boolean' },
          locales: enumArray(locales),
          email: { type: 'boolean' },
          css: { type: 'enum', enum: css },
          api_domain: { type: 'string' },
          endpoint: {
            ...enumObject(endpoint),
            fields: {
              gateway: { type: 'string' },
              button: { type: 'string' },
            },
          },
          fee: { type: 'boolean' },
          active_tab: { type: 'enum', enum: methods },
          logo_url: {
            type: 'string',
            pattern: patternUrlImg,
          },
          offerta_url: { type: 'url' },
          default_country: { type: 'enum', enum: configCountries },
          countries: enumArray(configCountries),
          theme: {
            ...enumObject(['type', 'preset']),
            fields: {
              type: { type: 'enum', enum: theme },
              preset: { type: 'enum', enum: preset },
            },
          },
          disable_request: { type: 'boolean' },
          show_button_amount: { type: 'boolean' },
          subscription: {
            ...enumObject(subscription),
            fields: {
              type: { type: 'enum', enum: subscriptionType },
              periods: enumArray(period),
              quantity: { type: 'boolean' },
              trial: { type: 'boolean' },
              unlimited: { type: 'boolean' },
            },
          },
        },
      },
      params: {
        type: 'object',
        fields: {
          merchant_id: { type: 'integer', max: 999999999999 },
          order_desc: { type: 'string', max: 1024 },
          amount: [{ type: 'integer', max: 999999999999 }, validatorToken()],
          currency: [
            { type: 'string' },
            validatorToken(),
            validatorCurrencyRequired(),
          ],
          response_url: { type: 'url' },
          lang: { type: 'enum', enum: locales },
          required_rectoken: { type: 'enum', enum: YN },
          verification: { type: 'enum', enum: YN },
          verification_type: { type: 'enum', enum: verificationType },
          token: { type: 'string', len: 40 },
          offer: { type: 'boolean' },
          recurring_data: {
            ...enumObject(recurring_data),
            fields: {
              period: { type: 'enum', enum: period },
              every: { type: 'integer' },
              start_time: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
              end_time: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
              amount: { type: 'integer' },
              quantity: { type: 'integer' },
              trial_period: { type: 'string' },
              trial_quantity: { type: 'integer' },
            },
          },
          custom: { type: 'object' },
          customer_data: { type: 'object' },
        },
      },
      messages: i18n,
      validate: i18n,
      css_variable,
    },
  },
}
