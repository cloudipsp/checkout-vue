import configLocales from '@/config/locales'
import configMethods from '@/config/methods'
import configCountries from '@/config/countries'
import rules from 'async-validator/es/rule/'
import cssVarisble from '@/config/css-varisble'
import presetGradient from '@/config/preset-gradient'

const methods = configMethods
const cardIcons = [
  'mastercard',
  'visa',
  'mir',
  'prostir',
  'diners',
  'american_express',
  'jcb',
  'maestro',
  'union_pay',
]
const locales = configLocales
const period = ['day', 'week', 'month']
const css = ['bootstrap3', 'bootstrap4', 'foundation6']
const YN = ['Y', 'N', 'y', 'n']
const verificationType = ['amount', 'code']
const theme = ['light', 'dark']
const preset = [
  'fondy',
  'steel_blue',
  'light_sky_blue',
  'dark_cyan',
  'light_coral',
  'red',
  'black',
  'white',
  ...presetGradient,
]

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

let i18n = {
  type: 'object',
  fields: {},
}
locales.forEach(function(locale) {
  i18n.fields[locale] = {
    type: 'object',
  }
})

const cssVarisbleKeys = Object.keys(
  cssVarisble({
    type: 'light',
    preset: 'fondy',
  })
)

let css_variable = enumObject(cssVarisbleKeys)

cssVarisbleKeys.forEach(item => {
  css_variable.fields[item] = {
    type: 'string',
    pattern: /^#[0-9a-fA-F]{6}$/,
  }
})

export default {
  options: {
    type: 'object',
    fields: {
      methods: enumArray(methods),
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
        type: 'object',
        fields: {
          gateway: { type: 'string' },
          button: { type: 'string' },
        },
      },
      fee: { type: 'boolean' },
      active_tab: { type: 'enum', enum: methods },
      logo_url: { type: 'url' },
      offerta_url: { type: 'url' },
      cancel: { type: 'boolean' },
      default_country: { type: 'enum', enum: configCountries },
      countries: enumArray(configCountries),
      theme: {
        type: 'object',
        fields: {
          type: { type: 'enum', enum: theme },
          preset: { type: 'enum', enum: preset },
        },
      },
    },
  },
  regular: {
    type: 'object',
    fields: {
      insert: { type: 'boolean' },
      open: { type: 'boolean' },
      hide: { type: 'boolean' },
      period: enumArray(period),
    },
  },
  params: {
    type: 'object',
    fields: {
      merchant_id: { type: 'integer', max: 999999999999 },
      order_desc: { type: 'string', required: true, max: 1024 },
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
        type: 'object',
        fields: {
          period: { type: 'enum', enum: period },
          every: { type: 'integer' },
          start_time: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
          end_time: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
          amount: { type: 'integer' },
        },
      },
      custom: { type: 'object' },
      customer_data: { type: 'object' },
    },
  },
  messages: i18n,
  validate: i18n,
  css_variable,
}
