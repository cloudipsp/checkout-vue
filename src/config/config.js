import configLocales from '@/config/locales'
import configPaymentSystems from '@/config/payment-systems'
import configMethods from '@/config/methods'
import configCountries from '@/config/countries'
import rules from 'async-validator/es/rule/'
import cssVarisble from '@/config/css-varisble'

let methods = configMethods
let ibank = Object.keys(configPaymentSystems.ibank)
let emoney = Object.keys(configPaymentSystems.emoney)
let cash = Object.keys(configPaymentSystems.cash)
let fast = [].concat(ibank, emoney, cash)
let cardIcons = [
  'mastercard',
  'visa',
  'mir',
  'prostir',
  'diners-club',
  'american-express',
]
let locales = Object.keys(configLocales)
let period = ['day', 'week', 'month']
let css = ['bootstrap3', 'bootstrap4', 'foundation6']
// let currency = ['UAH', 'RUB', 'USD', 'EUR', 'GBP', 'CZK']
let YN = ['Y', 'N', 'y', 'n']
let verificationType = ['amount', 'code']

function validatorArray(array) {
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

function validatorObject(array) {
  return {
    type: 'object',
    fields: {},
    validator(rule, value, callback) {
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
      if (!source.token && !source[rule.field]) {
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

let wallet_pay_button = {
  type: 'object',
  fields: {},
}
methods.concat('menu').forEach(function(method) {
  wallet_pay_button.fields[method] = {
    type: 'object',
    fields: {
      position: { type: 'enum', enum: ['top', 'bottom'] },
      display: { type: 'boolean' },
      theme: { type: 'enum', enum: ['dark', 'light'] },
      text: { type: 'boolean' },
    },
  }
})

let css_variable = validatorObject(Object.keys(cssVarisble))

Object.keys(cssVarisble).forEach(item => {
  css_variable.fields[item] = {
    type: 'string',
    pattern: /^#[0-9a-fA-F]{6}$/,
  }
})

export default {
  options: {
    type: 'object',
    fields: {
      methods: validatorArray(methods),
      ibank: validatorArray(ibank),
      emoney: validatorArray(emoney),
      cash: validatorArray(cash),
      fast: validatorArray(fast),
      card_icons: validatorArray(cardIcons),
      fields: { type: 'boolean' },
      title: { type: 'string' },
      link: { type: 'url' },
      full_screen: { type: 'boolean' },
      button: { type: 'boolean' },
      locales: validatorArray(locales),
      email: { type: 'boolean' },
      css: { type: 'enum', enum: css },
      tooltip: { type: 'boolean' },
      api_domain: { type: 'string' },
      fee: { type: 'boolean' },
      active_tab: { type: 'enum', enum: methods },
      logo_url: { type: 'url' },
      offerta_url: { type: 'url' },
      cancel: { type: 'boolean' },
      default_country: { type: 'enum', enum: configCountries },
      countries: validatorArray(configCountries),
      wallet_pay_button,
    },
  },
  popup: {
    type: 'object',
    fields: {
      append_to: { type: 'string' },
    },
  },
  regular: {
    type: 'object',
    fields: {
      insert: { type: 'boolean' },
      open: { type: 'boolean' },
      hide: { type: 'boolean' },
      period: validatorArray(period),
    },
  },
  params: {
    type: 'object',
    fields: {
      merchant_id: { type: 'integer', max: 999999999999 },
      order_desc: { type: 'string', max: 1024 },
      amount: [{ type: 'integer', max: 999999999999 }, validatorToken()],
      // currency: { type: 'enum', enum: currency },
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
