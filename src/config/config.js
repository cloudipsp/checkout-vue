import configLocales from '@/config/locales'
import configPaymentSystems from '@/config/payment-systems'
import rules from 'async-validator/es/rule/'

let i18n = {}
let methods = ['card', 'emoney', 'ibank', 'cash', 'sepa']
let ibank = Object.keys(configPaymentSystems.ibank)
let emoney = Object.keys(configPaymentSystems.emoney)
let cash = Object.keys(configPaymentSystems.cash)
let fast = [].concat(ibank, emoney, cash)
let cardIcons = ['mastercard', 'visa', 'mir', 'prostir', 'diners-club', 'american-express']
let locales = configLocales
let period = ['day', 'week', 'month']
let css = ['bootstrap3', 'bootstrap4', 'foundation6']
// let currency = ['UAH', 'RUB', 'USD', 'EUR', 'GBP', 'CZK']
let YN = ['Y', 'N', 'y', 'n']
let verificationType = ['amount', 'code']

let validatorArray = function (array) {
  return {
    validator(rule, value, callback, source, options) {
      rule.type = 'array'
      let validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
      let errors = []
      if (validate) {
        if (Array.isArray(value)) {
          value.forEach(function (item) {
            if (array.indexOf(item) < 0) {
              errors.push([rule.fullField, item, 'is not equal to one of', array.join(', ')].join(' '))
            }
          })
        } else {
          rules.type(rule, value, source, errors, options);
        }
      }
      callback(errors)
    }
  }
}

let validatorToken = function () {
  return {
    validator(rule, value, callback, source, options) {
      let errors = []
      if (source.token && rule.field in source) {
        errors.push(['Parameter', rule.fullField, 'can\'t be modified when token is used.'].join(' '))
      }
      callback(errors)
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
      methods: validatorArray(methods),
      ibank: validatorArray(ibank),
      emoney: validatorArray(emoney),
      cash: validatorArray(cash),
      fast: validatorArray(fast),
      card_icons: validatorArray(cardIcons),
      fields: {type: 'boolean'},
      title: {type: 'string'},
      link: {type: 'url',required: true},
      full_screen: {type: 'boolean'},
      button: {type: 'boolean'},
      locales: validatorArray(locales),
      email: {type: 'boolean'},
      css: {type: 'enum', enum: css},
      tooltip: {type: 'boolean'},
      api_domain: {type: 'string'},
      fee: {type: 'boolean'},
      active_tab: {type: 'enum', enum: methods},
      logo_url: {type: 'url'},
      offerta_url: {type: 'url'},
      cancel: {type: 'boolean'},
    }
  },
  popup: {
    type: 'object',
    fields: {
      append_to: {type: 'string'}
    }
  },
  regular: {
    type: 'object',
    fields: {
      insert: {type: 'boolean'},
      open: {type: 'boolean'},
      hide: {type: 'boolean'},
      period: validatorArray(period)
    }
  },
  params: {
    type: 'object',
    fields: {
      merchant_id: {type: 'integer', max: 999999999999},
      order_desc: {type: 'string', max: 1024},
      amount: [
        {type: 'integer', max: 999999999999},
        validatorToken()
      ],
      // currency: { type: 'enum', enum: currency },
      currency: [
        {type: 'string'},
        validatorToken()
      ],
      response_url: {type: 'url'},
      lang: {type: 'enum', enum: locales},
      required_rectoken: {type: 'enum', enum: YN},
      verification: {type: 'enum', enum: YN},
      verification_type: {type: 'enum', enum: verificationType},
      token: {type: 'string', len: 40},
      offer: {type: 'boolean'},
      recurring_data: {
        type: 'object',
        fields: {
          period: {type: 'enum', enum: period},
          every: {type: 'integer'},
          start_time: {type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/},
          end_time: {type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/},
          amount: {type: 'integer'}
        }
      },
      custom: {type: 'object'},
      customer_data: {type: 'object'},
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
