import configLocales from '@/config/locales'
import configPaymentSystems from '@/config/payment-systems'

let i18n = {}
let methods = ['card', 'emoney', 'ibank', 'cash', 'sepa']
let ibank = Object.keys(configPaymentSystems.ibank)
let emoney = Object.keys(configPaymentSystems.emoney)
let cash = Object.keys(configPaymentSystems.cash)
let fast = [].concat(ibank, emoney, cash)
let cardIcons = ['mastercard', 'visa', 'mir', 'prostir', 'diners-club', 'american-express']
let locales = Object.keys(configLocales)
let period = ['day', 'week', 'month', 'year']
let css = ['bootstrap3', 'bootstrap4', 'foundation6']
let currency = ['UAH', 'RUB', 'USD', 'EUR', 'GBP', 'CZK']
let YN = ['Y', 'N', 'y', 'n']
let verificationType = ['amount', 'code']

let notSet = {
  validator (rule, value, callback) {
    callback(value !== undefined ? [rule.fullField + ' not set']: [])
  }
}

let validatorArray = function (array) {
  return function (rule, value, callback) {
    let flag = false
    let errors = []
    value.forEach(function (item) {
      if(array.indexOf(item) < 0) {
        flag = true
        errors.push([rule.fullField,item,'is not equal to one of',array.join(', ')].join(' '))
      }
    })
    if (flag) {
      callback(errors)
    } else {
      callback([])
    }
  }
}

locales.forEach(function (locale) {
  i18n[locale] = {
    type: 'object'
  }
})

export default {
  options: {
    type: 'object',
    fields: {
      methods: { type: 'array', validator: validatorArray(methods) },
      ibank: { type: 'array', validator: validatorArray(ibank) },
      emoney: { type: 'array', validator: validatorArray(emoney) },
      cash: { type: 'array', validator: validatorArray(cash) },
      fast: { type: 'array', validator: validatorArray(fast) },
      cardIcons: { type: 'array', validator: validatorArray(cardIcons) },
      fields: { type: 'boolean' },
      offer: { type: 'boolean' },
      title: { type: 'string' },
      link: { type: 'url' },
      fullScreen: { type: 'boolean' },
      button: { type: 'boolean' },
      locales: { type: 'array', validator: validatorArray(locales) },
      email: { type: 'boolean' },
      css:{ type: 'enum', enum: css },
    }
  },
  regular: {
    type: 'object',
    fields: {
      insert: { type: 'boolean' },
      open: { type: 'boolean' },
      hide: { type: 'boolean' },
      period: { type: 'array', validator: validatorArray(period) },
    }
  },
  recurring: {
    type: 'object',
    fields: {
      period: { type: 'enum', enum: period },
      every: { type: 'integer' },
      start_time: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/},
      end_time: { type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/},
      amount: { type: 'integer' }
    }
  },
  params: {
    type: 'object',
    fields: {
      merchant_id: { type: 'integer', max: 999999999999 },
      order_desc: { type: 'string', max: 1024},
      amount: { type: 'integer' , max: 999999999999 },
      currency: { type: 'enum', enum: currency },
      response_url: { type: 'url'},
      lang: { type: 'enum', enum: locales },
      required_rectoken: { type: 'enum', enum: YN },
      verification: { type: 'enum', enum: YN },
      verification_type: { type: 'enum', enum: verificationType },
      email: { type: 'email'},
      token: { type: 'string', len: 40},
      fee: { type: 'float' },

      amount_with_fee: notSet,
      card_number: notSet,
      expiry_date: notSet,
      cvv2: notSet,
      code: notSet,
      offer: notSet
    }
  },
  messages: {
    type: 'object',
    fields: i18n
  },
  validate: {
    type: 'object',
    fields: i18n
  }
}
