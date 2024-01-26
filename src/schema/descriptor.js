import configLocales from '@/config/locales.json'
import methods from '@/config/methods.json'
import period from '@/config/subscription-period.json'
import configCountries from '@umpirsky/country-list/data/en/country.json'
import cssVariable from '@/config/css-variable'
import configPresets from '@/config/presets'
import configTheme from '@/config/theme'
import { configDefault } from '@/config/config-default'
import configSubscription from '@/config/subscription'
import { excludeMessages } from '@/config/exclude-messages'
import { isPlainObject, isString } from '@/utils/inspect'
import { loadAsyncValidator } from '@/import'

const countries = Object.keys(configCountries)
const cardIcons = [
  'american_express',
  'diners',
  'discover',
  'jcb',
  'maestro',
  'mastercard',
  'mir',
  'prostir',
  'rupay',
  'union_pay',
  'visa',
]
const YN = ['Y', 'N', 'y', 'n']
const verificationType = ['amount', 'code']
const themeType = Object.keys(configTheme)
const preset = Object.keys(configPresets)
const locales = Object.keys(configLocales)
const options = Object.keys(configDefault.options)
const endpoint = Object.keys(configDefault.options.endpoint)
const subscription = Object.keys(configDefault.options.subscription)
const theme = Object.keys(configDefault.options.theme)
const recurring_data = Object.keys(configDefault.params.recurring_data)
const subscriptionType = Object.keys(configSubscription)
const config = [
  'options',
  'params',
  'messages',
  'validate',
  'css_variable',
  'button',
  'fields_custom',
]
const patternUrlImg = /^(http(s)?:\/\/|(url\()?data:image\/[\w+;]+?,)/
const messageEnum = 'is not equal to one of'
const messageExclude = 'should not include one of'
const typeBoolean = { type: 'boolean' }
const typeString = { type: 'string' }
const typeInteger = { type: 'integer' }
const typeUrl = { type: 'url' }
const typeEnum = value => ({ type: 'enum', enum: value })
const typeDate = { ...typeString, pattern: /^\d{4}-\d{2}-\d{2}$/ }
const typeIntegerMax = max => ({ ...typeInteger, max })
const typeObject = { type: 'object' }
const typeArray = { type: 'array' }
const digits12 = 999999999999

function error(array, includes, rule, value, callback, message) {
  callback(
    value
      .filter(item => (includes ? !array.includes(item) : array.includes(item)))
      .reduce(
        (accum, item) =>
          accum.concat(
            [rule.fullField, item, message, array.join(', ')].join(' ')
          ),
        []
      )
  )
}

function enumArray(array) {
  return {
    ...typeArray,
    validator(rule, value, callback, source, options) {
      if (!Array.isArray(value))
        return loadAsyncValidator().then(Schema =>
          Schema.validators.array(rule, value, callback, source, options)
        )

      error(array, true, rule, value, callback, messageEnum)
    },
  }
}

function enumObject(array) {
  return {
    ...typeObject,
    fields: {},
    validator(rule, value, callback, source, options) {
      if (!isPlainObject(value))
        return loadAsyncValidator().then(Schema =>
          Schema.validators.object(rule, value, callback, source, options)
        )

      error(array, true, rule, Object.keys(value), callback, messageEnum)
    },
  }
}

function excludeObject(array) {
  return {
    ...typeObject,
    validator(rule, value, callback, source, options) {
      if (!isPlainObject(value))
        return loadAsyncValidator().then(Schema =>
          Schema.validators.object(rule, value, callback, source, options)
        )

      error(array, false, rule, Object.keys(value), callback, messageExclude)
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

function conflictTokenButton() {
  return {
    validator(rule, value, callback, { token, button }) {
      callback(
        token && button
          ? "Conflict error: order token and button token can't be used concurrently."
          : []
      )
    },
  }
}

function validatorCurrencyRequired() {
  return {
    validator(rule, value, callback, { token, button }) {
      let errors = []
      if (!token && !button && !value) {
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

function validatorPreset() {
  return {
    validator(...args) {
      let [rule, value] = args
      return loadAsyncValidator().then(Schema => {
        let type
        if (!isString(value)) {
          type = 'string'
        } else if (value.charAt(0) === '#') {
          type = 'pattern'
          rule.pattern = /^#[0-9a-fA-F]{6}$/
        } else {
          type = 'enum'
          rule.enum = preset
        }
        return Schema.validators[type](...args)
      })
    },
  }
}

let messages = enumObject(locales)

locales.forEach(function (locale) {
  messages.fields[locale] = {
    ...excludeObject(excludeMessages),
    fields: {
      offerta_url: typeUrl,
    },
  }
})

let validate = enumObject(locales)

locales.forEach(function (locale) {
  validate.fields[locale] = typeObject
})

const cssVariableKeys = Object.keys(
  cssVariable({
    type: 'light',
    preset: configTheme['light'],
  })
)

let css_variable = enumObject(cssVariableKeys)

const configCssVariable = {
  card_img: {
    ...typeString,
    pattern: patternUrlImg,
  },
}

cssVariableKeys.forEach(item => {
  css_variable.fields[item] = configCssVariable[item] || [
    validatorNotEmpty(),
    {
      ...typeString,
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
          fields: typeBoolean,
          title: typeString,
          link: typeUrl,
          full_screen: typeBoolean,
          button: typeBoolean,
          locales: enumArray(locales),
          email: typeBoolean,
          api_domain: typeString,
          endpoint: {
            ...enumObject(endpoint),
            fields: {
              gateway: typeString,
              button: typeString,
            },
          },
          fee: typeBoolean,
          active_tab: typeEnum(methods),
          active_method: typeString,
          logo_url: {
            ...typeString,
            pattern: patternUrlImg,
          },
          offerta_url: typeUrl,
          default_country: typeEnum(countries),
          countries: enumArray(countries),
          theme: {
            ...enumObject(theme),
            fields: {
              type: typeEnum(themeType),
              preset: validatorPreset(),
            },
          },
          disable_request: typeBoolean,
          show_button_amount: typeBoolean,
          subscription: {
            ...enumObject(subscription),
            fields: {
              type: typeEnum(subscriptionType),
              periods: enumArray(period),
              quantity: typeBoolean,
              trial: typeBoolean,
              unlimited: typeBoolean,
              readonly: typeBoolean,
            },
          },
          loading: {
            type: 'string',
            pattern: patternUrlImg,
          },
          hide_button_title: typeBoolean,
          amount_readonly: typeBoolean,
        },
      },
      params: {
        ...typeObject,
        fields: {
          merchant_id: typeIntegerMax(digits12),
          order_desc: { ...typeString, max: 1024 },
          amount: [typeIntegerMax(digits12), validatorToken()],
          currency: [typeString, validatorToken(), validatorCurrencyRequired()],
          response_url: typeUrl,
          lang: typeEnum(locales),
          required_rectoken: typeEnum(YN),
          verification: typeEnum(YN),
          verification_type: typeEnum(verificationType),
          token: [{ ...typeString, len: 40 }, conflictTokenButton()],
          button: { ...typeString, min: 20, max: 80 },
          offer: typeBoolean,
          recurring_data: {
            ...enumObject(recurring_data),
            fields: {
              period: typeEnum(period),
              every: typeInteger,
              start_time: typeDate,
              end_time: typeDate,
              amount: typeInteger,
              quantity: typeInteger,
              trial_period: typeString,
              trial_quantity: typeInteger,
            },
          },
          custom: typeObject,
          customer_data: typeObject,
        },
      },
      messages,
      validate,
      css_variable,
      button: {
        ...typeObject,
      },
      fields_custom: {
        ...typeObject,
      },
    },
  },
}
